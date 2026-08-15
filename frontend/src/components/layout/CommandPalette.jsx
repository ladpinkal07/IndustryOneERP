import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/router';
import { NAVIGATION_CONFIG } from '../../config/navigation';

export default function CommandPalette({ isOpen, onClose }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Flatten all navigable items
  const allItems = useMemo(() => {
    const list = [];
    NAVIGATION_CONFIG.forEach((group) => {
      group.items.forEach((item) => {
        list.push({
          id: item.id || item.path,
          label: item.label,
          path: item.path,
          icon: item.icon,
          category: group.category,
          keywords: item.keywords || [],
        });
        if (item.children) {
          item.children.forEach((child) => {
            list.push({
              id: child.path,
              label: `${item.label} › ${child.label}`,
              path: child.path,
              icon: child.icon || item.icon,
              category: group.category,
              keywords: item.keywords || [],
            });
          });
        }
      });
    });
    return list;
  }, []);

  // Filter items based on query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 8);
    const q = query.toLowerCase().trim();
    return allItems
      .filter((item) => {
        const matchLabel = item.label.toLowerCase().includes(q);
        const matchKeywords = item.keywords.some((kw) => kw.toLowerCase().includes(q));
        const matchCategory = item.category.toLowerCase().includes(q);
        return matchLabel || matchKeywords || matchCategory;
      })
      .slice(0, 10);
  }, [allItems, query]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation inside modal
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const handleSelect = (item) => {
    onClose();
    router.push(item.path);
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(2px)', zIndex: 1060 }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        style={{ maxWidth: '580px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 shadow-lg overflow-hidden" style={{ borderRadius: '12px' }}>
          {/* Header search bar */}
          <div className="p-3 border-bottom d-flex align-items-center gap-2 bg-body">
            <span className="fs-5 text-muted">🔍</span>
            <input
              ref={inputRef}
              type="text"
              className="form-control form-control-lg border-0 shadow-none bg-transparent ps-1"
              placeholder="Type a command, module, or search keyword..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
            />
            <span className="badge bg-secondary-subtle text-secondary border small px-2 py-1">ESC</span>
          </div>

          {/* Search results list */}
          <div className="p-2 overflow-y-auto" style={{ maxHeight: '360px' }}>
            {filteredItems.length === 0 ? (
              <div className="text-center py-4 text-muted small">
                No matching ERP modules or commands found for &quot;{query}&quot;
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {filteredItems.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`list-group-item list-group-item-action d-flex align-items-center justify-content-between p-2 rounded-2 border-0 mb-1 ${
                        isSelected ? 'active bg-primary text-white' : ''
                      }`}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <span className="fs-5">{item.icon}</span>
                        <div className="text-start">
                          <div className={`fw-medium ${isSelected ? 'text-white' : 'text-dark'}`}>
                            {item.label}
                          </div>
                          <div className={`small ${isSelected ? 'text-white-50' : 'text-muted'}`}>
                            {item.category}
                          </div>
                        </div>
                      </div>
                      <span className={`small ${isSelected ? 'text-white-50' : 'text-secondary'}`}>
                        Jump ↵
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer hints */}
          <div className="p-2 px-3 border-top bg-body-tertiary d-flex justify-content-between align-items-center small text-muted">
            <span>Navigation: <kbd className="bg-light border text-dark px-1">↑</kbd> <kbd className="bg-light border text-dark px-1">↓</kbd></span>
            <span>Select: <kbd className="bg-light border text-dark px-1">↵ Enter</kbd></span>
            <span>Close: <kbd className="bg-light border text-dark px-1">Esc</kbd></span>
          </div>
        </div>
      </div>
    </div>
  );
}

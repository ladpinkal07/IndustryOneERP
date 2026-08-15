import { PAGINATION } from '../../utils/constants';

export default function Pagination({
  page = 1,
  pageSize = PAGINATION.DEFAULT_PAGE_SIZE,
  totalRecords = 0,
  totalPages = 0,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = PAGINATION.PAGE_SIZE_OPTIONS,
}) {
  if (totalRecords === 0 && totalPages <= 1) {
    return null;
  }

  const startRecord = (page - 1) * pageSize + 1;
  const endRecord = Math.min(page * pageSize, totalRecords);

  // Generate visible page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 py-3 border-top">
      {/* Metric details */}
      <div className="text-muted small">
        Showing <span className="fw-semibold text-dark">{startRecord}</span> to{' '}
        <span className="fw-semibold text-dark">{endRecord}</span> of{' '}
        <span className="fw-semibold text-dark">{totalRecords}</span> records
      </div>

      {/* Navigation and Page Size */}
      <div className="d-flex align-items-center gap-3">
        {onPageSizeChange && (
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted small">Per page:</span>
            <select
              className="form-select form-select-sm"
              style={{ width: 'auto' }}
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}

        <nav aria-label="Table navigation">
          <ul className="pagination pagination-sm mb-0">
            <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                aria-label="Previous page"
              >
                &laquo;
              </button>
            </li>

            {getPageNumbers().map((p) => (
              <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                <button className="page-link" onClick={() => onPageChange(p)}>
                  {p}
                </button>
              </li>
            ))}

            <li className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                aria-label="Next page"
              >
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

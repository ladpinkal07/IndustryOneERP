import React from 'react';
import Badge from '../common/Badge';
import { useNotification } from '../../context/NotificationContext';

export default function NotificationDropdown() {
  const {
    notifications,
    markAllNotificationsAsRead,
    removeNotification,
    clearAllNotifications,
  } = useNotification();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="dropdown">
      <button
        className="btn btn-sm btn-outline-secondary position-relative border-0 rounded-circle p-2"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        title="Notifications Center"
      >
        🔔
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
            <span className="visually-hidden">{unreadCount} unread notifications</span>
          </span>
        )}
      </button>

      <ul className="dropdown-menu dropdown-menu-end shadow-sm py-0 overflow-hidden" style={{ minWidth: '320px', borderRadius: '10px' }}>
        {/* Header */}
        <li className="d-flex justify-content-between align-items-center px-3 py-2 bg-body-tertiary border-bottom">
          <div className="d-flex align-items-center gap-2">
            <span className="fw-bold small">Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="danger" pill className="small">
                {unreadCount} new
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              className="btn btn-link btn-sm text-primary p-0 text-decoration-none small"
              onClick={markAllNotificationsAsRead}
            >
              Mark all read
            </button>
          )}
        </li>

        {/* Notifications List */}
        <li className="p-0 overflow-y-auto" style={{ maxHeight: '280px' }}>
          {notifications.length === 0 ? (
            <div className="text-center py-4 text-muted small">No notifications</div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`dropdown-item px-3 py-2 border-bottom d-flex justify-content-between align-items-start gap-2 ${
                  !item.read ? 'bg-primary-subtle bg-opacity-25' : ''
                }`}
                style={{ whiteSpace: 'normal', cursor: 'pointer' }}
              >
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="fw-semibold small text-dark">{item.title}</span>
                    <span className="text-muted" style={{ fontSize: '10px' }}>{item.time}</span>
                  </div>
                  <div className="text-muted small mt-1">{item.message}</div>
                </div>
                <button
                  type="button"
                  className="btn-close ms-1"
                  style={{ width: '8px', height: '8px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNotification(item.id);
                  }}
                  aria-label="Dismiss notification"
                />
              </div>
            ))
          )}
        </li>

        {/* Footer */}
        <li className="text-center py-2 bg-body-tertiary">
          <button
            className="btn btn-link btn-sm text-muted text-decoration-none small p-0"
            onClick={clearAllNotifications}
          >
            Clear all notifications
          </button>
        </li>
      </ul>
    </div>
  );
}

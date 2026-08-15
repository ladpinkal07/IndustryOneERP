import React, { createContext, useContext, useState, useCallback } from 'react';
import ConfirmDialog from '../components/common/ConfirmDialog';

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    component: null,
    props: {},
  });

  const [drawerState, setDrawerState] = useState({
    isOpen: false,
    component: null,
    props: {},
  });

  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: 'Confirm Action',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmVariant: 'danger',
    onConfirm: null,
    loading: false,
  });

  // Programmatic Modal
  const openModal = useCallback((component, props = {}) => {
    setModalState({
      isOpen: true,
      component,
      props,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Programmatic Drawer
  const openDrawer = useCallback((component, props = {}) => {
    setDrawerState({
      isOpen: true,
      component,
      props,
    });
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Programmatic Confirmation Dialog
  const confirm = useCallback(({
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmVariant = 'danger',
    onConfirm,
  }) => {
    setConfirmState({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      confirmVariant,
      onConfirm: async () => {
        if (onConfirm) {
          setConfirmState((prev) => ({ ...prev, loading: true }));
          try {
            await onConfirm();
          } finally {
            setConfirmState((prev) => ({ ...prev, isOpen: false, loading: false }));
          }
        } else {
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
        }
      },
      loading: false,
    });
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const value = {
    openModal,
    closeModal,
    openDrawer,
    closeDrawer,
    confirm,
  };

  const ModalComponent = modalState.component;
  const DrawerComponent = drawerState.component;

  return (
    <ModalContext.Provider value={value}>
      {children}

      {/* Programmatic Modal Renderer */}
      {ModalComponent && (
        <ModalComponent
          isOpen={modalState.isOpen}
          onClose={closeModal}
          {...modalState.props}
        />
      )}

      {/* Programmatic Drawer Renderer */}
      {DrawerComponent && (
        <DrawerComponent
          isOpen={drawerState.isOpen}
          onClose={closeDrawer}
          {...drawerState.props}
        />
      )}

      {/* Programmatic Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        confirmVariant={confirmState.confirmVariant}
        loading={confirmState.loading}
      />
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

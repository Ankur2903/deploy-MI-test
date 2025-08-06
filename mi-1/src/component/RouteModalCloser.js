import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Modal } from 'bootstrap';

const RouteModalCloser = () => {
  const location = useLocation();

  useEffect(() => {
    // Close any open modals on route change
    const openModals = document.querySelectorAll('.modal.show');
    openModals.forEach((modalElement) => {
      try {
        // Get existing modal instance or create one if needed
        let modalInstance = Modal.getInstance(modalElement);
        if (!modalInstance) {
          modalInstance = new Modal(modalElement);
        }
        modalInstance.hide();
      } catch (error) {
        console.warn('Modal close failed:', error);
      }
    });

    // Also remove modal-backdrop if any remains (Bootstrap sometimes misses it)
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach((backdrop) => backdrop.remove());

    // Remove modal-open class from body
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('padding-right');
  }, [location]);

  return null;
};

export default RouteModalCloser;

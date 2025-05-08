import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { createPortal } from 'react-dom';

const DeleteTeacherModal = ({ isOpen, onClose, teacher, onDelete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [portalNode, setPortalNode] = useState(null);
  
  // Check for mobile view and create portal node
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Create portal element
    if (!portalNode) {
      const node = document.createElement('div');
      node.id = 'teacher-delete-modal-root';
      document.body.appendChild(node);
      setPortalNode(node);
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      if (portalNode && portalNode.parentNode) {
        portalNode.parentNode.removeChild(portalNode);
      }
    };
  }, [portalNode]);

  // Handle body scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(teacher);
      onClose();
    } catch (error) {
      console.error('Error deleting teacher:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = (event, info) => {
    if (info.offset.y > 100) {
      onClose();
    }
    setDragging(false);
  };

  // Don't render if not open or no portal node
  if (!isOpen || !portalNode) return null;

  // Create modal content
  const modalContent = (
    <AnimatePresence mode="sync">
      {/* Backdrop/overlay */}
      <motion.div
        key="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* The modal window itself - conditionally render only one based on isMobile */}
      {isMobile ? (
        // Mobile view - bottom sheet
        <motion.div
          key="mobile-modal"
          ref={modalRef}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{
            type: 'spring',
            damping: 25,
            stiffness: 300
          }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 50 }}
          dragElastic={0.2}
          onDragStart={() => setDragging(true)}
          onDragEnd={handleDragEnd}
          onClick={(e) => e.stopPropagation()}
          className="fixed bottom-0 inset-x-0 mx-2 rounded-t-2xl bg-white dark:bg-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto z-50"
        >
          {/* Drag handle for mobile */}
          <div className="absolute left-0 right-0 top-3 flex justify-center">
            <div className="w-10 h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
          
          <div className="p-4 md:p-5 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-bold bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Confirm Deletion
              </h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
              >
                <FiX className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </motion.button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete {teacher?.name}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDelete}
                disabled={isLoading}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg shadow-md text-sm font-medium"
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      ) : (
        // Desktop view - centered modal
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            key="desktop-modal"
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300
            }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl w-full max-w-md max-h-[90vh] overflow-auto p-4 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-bold bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Confirm Deletion
              </h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
              >
                <FiX className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </motion.button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete {teacher?.name}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDelete}
                disabled={isLoading}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg shadow-md text-sm font-medium"
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // Render the portal
  return createPortal(modalContent, portalNode);
};

export default DeleteTeacherModal; 
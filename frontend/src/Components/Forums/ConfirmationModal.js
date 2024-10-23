import Swal from 'sweetalert2';

export const showConfirmationDialog = async ({ 
  title, 
  text, 
  confirmButtonText = 'Yes, delete it',
  cancelButtonText = 'Cancel',
  icon = 'warning' 
}) => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    confirmButtonText,
    cancelButtonText
  });

  return result.isConfirmed;
};

export const showReportDialog = async () => {
  const { value: reason } = await Swal.fire({
    title: 'Report Content',
    input: 'textarea',
    inputLabel: 'Reason for reporting',
    inputPlaceholder: 'Please explain why you are reporting this content...',
    inputAttributes: {
      'aria-label': 'Report reason'
    },
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Submit Report',
    cancelButtonText: 'Cancel',
    inputValidator: (value) => {
      if (!value) {
        return 'You need to provide a reason for the report';
      }
    }
  });

  return reason;
};
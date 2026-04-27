import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export const useShowSuccess = (id, setIsEditMode) => {
  const navigate = useNavigate();

  const showSuccess = async (uuid) => {
    const result = await Swal.fire({
      icon: 'success',
      title: 'Успешно',
      showCancelButton: true,
      confirmButtonText: 'На главную',
      cancelButtonText: 'Вернуться к инциденту',
      confirmButtonColor: 'var(--status-normal)',
      cancelButtonColor: 'var(--status-danger)',
      allowOutsideClick: false, // Закрыть можно только кнопкой
      backdrop: 'rgba(0,0,0,0.4)', // Затемнение фона
      background: 'var(--bg-app)',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      navigate('/');
      setIsEditMode(false);
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      navigate(`/incident/${uuid ? uuid : id}`);
      setIsEditMode(false);
    }
  };
  return { showSuccess };
};

import Swal from 'sweetalert2';

const SuccessNotification = (title,message, icon) => {
    const notification = Swal.fire({
        title:  title,
        text:  message,
        icon:  icon,
        confirmButtonColor: '#3085d6',
    });

    return notification;
}

export default SuccessNotification;
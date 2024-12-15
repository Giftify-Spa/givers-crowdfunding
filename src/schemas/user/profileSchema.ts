import * as yup from 'yup';

export const validationUserProfileSettingsSchema = yup.object().shape({
    rut: yup.string()
        .matches(/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/, 'Formato de RUT no válido')
        .required('El RUT es requerido'),
    name: yup.string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(50, 'El nombre no puede exceder los 50 caracteres')
        .required('El nombre es requerido'),
    lastname: yup.string()
        .min(3, 'El apellido debe tener al menos 3 caracteres')
        .max(50, 'El apellido no puede exceder los 50 caracteres')
        .required('El apellido es requerido'),
    email: yup.string()
        .email('Formato de correo electrónico no válido')
        .required('El correo electrónico es requerido'),
    phone: yup.string()
        .matches(/^[+]?[\d\s-]{7,15}$/, 'Formato de teléfono no válido')
        .required('El teléfono es requerido'),
});
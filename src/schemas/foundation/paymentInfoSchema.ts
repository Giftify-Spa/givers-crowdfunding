import * as yup from 'yup';

export const validationPaymentInfoFoundationSchema = yup.object().shape({
    // holderName: yup.string()
    //     .min(3, 'La razón social debe tener al menos 3 caracteres')
    //     .max(50, 'La razón social no puede exceder los 50 caracteres')
    //     .required('La razón sociales requerida'),
    bank: yup.string().required('El banco es requerido'),
    accountType: yup.string().required('El tipo de cuenta es requerido'),
    accountNumber: yup.string()
        .matches(/^\d+$/, 'El número de cuenta solo debe contener dígitos')
        .required('El número de cuenta es requerido'),
    email: yup.string()
        .email('Formato de correo electrónico no válido')
        .required('El correo electrónico es requerido'),
    // rut: yup.string()
    //     .matches(/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/, 'Formato de RUT no válido')
    //     .required('El RUT es requerido'),
});

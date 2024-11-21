import * as yup from 'yup';

export const validationFoundationSchema = yup.object().shape({
    name: yup.string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(50, 'El nombre no puede exceder los 50 caracteres')
        .required('El nombre es requerido'),
    description: yup.string()
        .min(3, 'La descripción debe tener al menos 10 caracteres')
        .max(200, 'La descripción no puede exceder los 200 caracteres')
        .required('La descripción es requerida'),
    country: yup.string().required('El país es requerido'),
    city: yup.string().required('La ciudad es requerida'),
    address: yup.string().required('La dirección es requerida'),
    fono: yup.string()
        .matches(/^[+]?[\d\s-]{7,15}$/, 'Formato de teléfono no válido')
        .required('El teléfono es requerido'),
    confidenceLevel: yup.number()
        .min(1, 'El nivel de confianza debe ser al menos 1')
        .max(5, 'El nivel de confianza no puede exceder 5')
        .required('El nivel de confianza es requerido'),
    responsible: yup.string().required('El responsable es requerido'),
    multimediaCount: yup.number().required('El contenido multimedia es requerido').min(1, 'Al menos una imagen es requerida').max(1, 'Solo se permite una imagen'),
});

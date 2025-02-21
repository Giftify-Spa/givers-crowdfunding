import * as yup from 'yup';

export const validationAdminCreateCampaignSchema = yup.object().shape({
    name: yup.string().required('El nombre de la campaña es requerido'),
    description: yup.string().required('La descripción de la campaña es requerida'),
    category: yup.string().required('La categoría de la campaña es requerida'),
    foundation: yup.string().required('La fundación de la campaña es requerida'),
    responsible: yup.string().required('El responsable de la campaña es requerido'),
    isCause: yup.boolean().required('El tipo de campaña es requerido'),
    isExperience: yup.boolean().required('El tipo de campaña es requerido'),
    requestAmount: yup.number().required('El monto de la campaña es requerido').min(1000, 'El monto de la campaña debe ser mayor a 1000'),
    initVideo: yup.string().required('El enlace del vídeo inicial de campaña es requerido'),
});
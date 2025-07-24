const Joi = require('joi');

const createAppointmentSchema = Joi.object({
  appointmentDate: Joi.date().iso().required().messages({
    'any.required': 'Appointment date is required',
    'date.base': 'Appointment date must be a valid ISO date'
  }),
  description: Joi.string().max(255).required().messages({
    'any.required': 'Description is required',
    'string.empty': 'Description is required',
    'string.max': 'Description must not exceed 255 characters'
  })
});


function validateCreateAppointment(req, res, next) {
  const { error } = createAppointmentSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map(detail => detail.message);
    return res.status(400).json({ errors: messages });
  }
  next();
}



module.exports = validateCreateAppointment;

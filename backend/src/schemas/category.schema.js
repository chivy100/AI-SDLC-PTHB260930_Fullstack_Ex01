const { z } = require('zod');

const categorySchema = z.object({
  name: z
    .string({ required_error: 'Tên thể loại là bắt buộc.' })
    .trim()
    .min(1, 'Tên thể loại không được để trống.')
    .max(100, 'Tên thể loại không được vượt quá 100 ký tự.')
});

module.exports = {
  categorySchema
};

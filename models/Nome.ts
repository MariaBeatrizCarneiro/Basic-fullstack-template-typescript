import mongoose, { Schema } from 'mongoose';

const nomeSchema = new Schema({
  nome: { type: String, required: true },
}, {
  versionKey: false
});

const Nome = mongoose.models.Nome || mongoose.model('Nome', nomeSchema);

export default Nome;

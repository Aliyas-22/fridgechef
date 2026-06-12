import mongoose, { Schema, Document } from 'mongoose';

export interface IRecipe extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookTime: string;
  servings: string;
  difficulty: string;
  cuisine: string;
  tips: string[];
  savedAt: Date;
}

const RecipeSchema = new Schema<IRecipe>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  ingredients: [String],
  instructions: [String],
  cookTime: String,
  servings: String,
  difficulty: String,
  cuisine: String,
  tips: [String],
  savedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Recipe || mongoose.model<IRecipe>('Recipe', RecipeSchema);

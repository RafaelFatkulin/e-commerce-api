import { Hono } from "hono";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  getCategoryByTitle,
  updateCategory,
} from "./categories.service";
import { sendError, sendSuccess } from "@/utils/response";
import { zValidator } from "@hono/zod-validator";
import {
  insertCategorySchema,
  updateCategorySchema,
} from "./categories.schema";
import { authMiddleware } from "../auth/auth.middleware";
import { DrizzleError } from "drizzle-orm";

export const categories = new Hono();

categories.get("/", async (c) => {
  try {
    const categories = await getCategories();
    return c.json(sendSuccess(categories));
  } catch (error) {
    return c.json(sendError("Не удалось получить список категорий"), 500);
  }
});

categories.get("/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const category = await getCategoryById(id);

    if (!category) {
      return c.json(sendError("Такая категория не найдена"), 404);
    }

    return c.json(sendSuccess(category));
  } catch (error) {
    return c.json(sendError("Такая категория не найдена"), 404);
  }
});

categories.post(
  "/",
  authMiddleware(["admin"]),
  zValidator("json", insertCategorySchema),
  async (c) => {
    try {
      const categoryData = c.req.valid("json");
      const exisitingCategory = await getCategoryByTitle(categoryData.title);

      if (exisitingCategory) {
        return c.json(sendError("Такая категория уже существует"), 409);
      }

      const category = await createCategory(categoryData);

      return c.json(
        sendSuccess(category, `Категория ${category.title} успешно создана`),
        201
      );
    } catch (error) {
      console.log(error);

      return c.json(sendError("Не удалось создать категорию"), 500);
    }
  }
);

categories.patch(
  "/:id",
  authMiddleware(["admin"]),
  zValidator("json", updateCategorySchema),
  async (c) => {
    try {
      const id = parseInt(c.req.param("id"));
      const categoryData = c.req.valid("json");

      const exisitingCategory = await getCategoryById(id);

      if (!exisitingCategory) {
        return c.json(sendError("Такая категория не найдена"), 404);
      }

      const updatedCategory = await updateCategory(
        id,
        categoryData.title
          ? categoryData
          : { title: exisitingCategory.title, slug: exisitingCategory.slug }
      );

      return c.json(
        sendSuccess(
          updatedCategory,
          `Категория ${updatedCategory.title} успешно обновлена`
        )
      );
    } catch (error) {
      console.log(error);

      return c.json(sendError("Не удалось обновить категорию"), 500);
    }
  }
);

categories.delete("/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const deletedCategory = await deleteCategory(id);

    if (!deletedCategory) {
      return c.json(sendError("Такая категория не найдена"), 404);
    }

    return c.json(
      sendSuccess(
        deletedCategory,
        `Категория ${deletedCategory.title} успешно удалена`
      )
    );
  } catch (error) {
    return c.json(sendError("Не удалось удалить категорию"), 500);
  }
});

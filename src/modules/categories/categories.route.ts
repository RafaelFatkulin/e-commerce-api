import { Hono } from "hono";
import { getCategories, getCategoryById } from "./categories.service";
import { sendError, sendSuccess } from "@/utils/response";

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
    return c.json(sendSuccess(category));
  } catch (error) {
    return c.json(sendError("Такая категория не найдена"), 500);
  }
});

// TODO Add create, update, delete methods, with access only for ADMIN, and also add slug param to category

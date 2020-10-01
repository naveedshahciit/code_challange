import * as Express from "express";
import Hero from "../models/hero";
import Heroes from "../data/heroes.json";

const findAll = async (req: Express.Request, res: Express.Response) => {
  res.send(Heroes);
};

const findById = async (req: Express.Request, res: Express.Response) => {
  res.send(Heroes.find((x) => x.id === req.params.id));
};

export default {
  findAll,
  findById,
};

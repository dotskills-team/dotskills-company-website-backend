import mongoose from "mongoose";

import { Service } from "./services.model.js";

import type {
  CreateServiceInput,
  ServiceListQuery,
  UpdateServiceInput,
} from "./services.validation.js";

export class ServiceService {
  async create(input: CreateServiceInput) {
    const existing = await Service.findOne({
      slug: input.slug,
    }).lean();

    if (existing) {
      throw new Error("SLUG_ALREADY_EXISTS");
    }

    return Service.create(input);
  }

  async getPublicServices(query: ServiceListQuery) {
    const filter: Record<string, unknown> = {
      isPublished: true,
    };

    if (query.category) {
      filter.category = query.category;
    }

    const skip = (query.page - 1) * query.limit;

    const [services, total] = await Promise.all([
      Service.find(filter)
        .sort({ sortOrder: 1, createdAt: 1 })
        .skip(skip)
        .limit(query.limit)
        .lean(),

      Service.countDocuments(filter),
    ]);

    return {
      services,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  async getPublicBySlug(slug: string) {
    return Service.findOne({
      slug,
      isPublished: true,
    }).lean();
  }

  async getAdminServices(query: ServiceListQuery) {
    const filter: Record<string, unknown> = {};

    if (query.category) {
      filter.category = query.category;
    }

    const skip = (query.page - 1) * query.limit;

    const [services, total] = await Promise.all([
      Service.find(filter)
        .sort({ sortOrder: 1, createdAt: 1 })
        .skip(skip)
        .limit(query.limit)
        .lean(),

      Service.countDocuments(filter),
    ]);

    return {
      services,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  async getAdminById(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error("INVALID_ID");
    }

    return Service.findById(id).lean();
  }

  async update(
    id: string,
    input: UpdateServiceInput,
  ) {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error("INVALID_ID");
    }

    if (input.slug) {
      const existing = await Service.findOne({
        slug: input.slug,
        _id: { $ne: id },
      }).lean();

      if (existing) {
        throw new Error("SLUG_ALREADY_EXISTS");
      }
    }

    return Service.findByIdAndUpdate(
      id,
      input,
      {
        new: true,
        runValidators: true,
      },
    ).lean();
  }

  async delete(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error("INVALID_ID");
    }

    return Service.findByIdAndDelete(id).lean();
  }
}

export const serviceService = new ServiceService();
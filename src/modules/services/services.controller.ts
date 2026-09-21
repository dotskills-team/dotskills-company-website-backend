import type {
  Request,
  Response,
} from "express";

import {
  createServiceSchema,
  serviceListQuerySchema,
  updateServiceSchema,
} from "./services.validation.js";

import { serviceService } from "./services.service.js";

export const createService = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const result = createServiceSchema.safeParse(
    req.body,
  );

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const service =
      await serviceService.create(result.data);

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: {
        service,
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "SLUG_ALREADY_EXISTS"
    ) {
      res.status(409).json({
        success: false,
        message: "A service with this slug already exists",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Unable to create service",
    });
  }
};

export const getPublicServices = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const result =
    serviceListQuerySchema.safeParse(req.query);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const data =
      await serviceService.getPublicServices(
        result.data,
      );

    res.status(200).json({
      success: true,
      message: "Services retrieved successfully",
      data,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Unable to retrieve services",
    });
  }
};

export const getPublicServiceBySlug = async (
  req: Request<{ slug: string }>,
  res: Response,
): Promise<void> => {
    const slug = req.params.slug;

    if (!slug) {
      res.status(400).json({
        success: false,
        message: "Service slug is required",
      });
      return;
    }

    try {
      const service =
        await serviceService.getPublicBySlug(
          slug,
        );

      if (!service) {
        res.status(404).json({
          success: false,
          message: "Service not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Service retrieved successfully",
        data: {
          service,
        },
      });
    } catch {
      res.status(500).json({
        success: false,
        message: "Unable to retrieve service",
      });
    }
  };

export const getAdminServices = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const result =
    serviceListQuerySchema.safeParse(req.query);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const data =
      await serviceService.getAdminServices(
        result.data,
      );

    res.status(200).json({
      success: true,
      message: "Admin services retrieved successfully",
      data,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Unable to retrieve services",
    });
  }
};

export const getAdminServiceById = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
    const id = req.params.id;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Service ID is required",
      });
      return;
    }

    try {
      const service =
        await serviceService.getAdminById(id);

      if (!service) {
        res.status(404).json({
          success: false,
          message: "Service not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Service retrieved successfully",
        data: {
          service,
        },
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "INVALID_ID"
      ) {
        res.status(400).json({
          success: false,
          message: "Invalid service ID",
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Unable to retrieve service",
      });
    }
  };

export const updateService = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  const result =
    updateServiceSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
    return;
  }

  const id = req.params.id;

  if (!id) {
    res.status(400).json({
      success: false,
      message: "Service ID is required",
    });
    return;
  }

  try {
    const service =
      await serviceService.update(
        id,
        result.data,
      );

    if (!service) {
      res.status(404).json({
        success: false,
        message: "Service not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: {
        service,
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "INVALID_ID"
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
      return;
    }

    if (
      error instanceof Error &&
      error.message === "SLUG_ALREADY_EXISTS"
    ) {
      res.status(409).json({
        success: false,
        message:
          "A service with this slug already exists",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Unable to update service",
    });
  }
};

export const deleteService = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  const id = req.params.id;

  if (!id) {
    res.status(400).json({
      success: false,
      message: "Service ID is required",
    });
    return;
  }

  try {
    const service =
      await serviceService.delete(id);

    if (!service) {
      res.status(404).json({
        success: false,
        message: "Service not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "INVALID_ID"
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Unable to delete service",
    });
  }
};
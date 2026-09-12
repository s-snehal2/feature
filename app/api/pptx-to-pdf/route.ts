import { convert } from "pptx-to-pdf";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json(
        {
          error: "No PPTX file received",
        },
        {
          status: 400,
        },
      );
    }

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (extension !== "pptx") {
      return Response.json(
        {
          error: "Only PPTX files are supported",
        },
        {
          status: 400,
        },
      );
    }

    const arrayBuffer = await file.arrayBuffer();

    const pptxBuffer = Buffer.from(arrayBuffer);

    const pdfBuffer = await convert(pptxBuffer);

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${file.name.replace(/\.pptx$/i, ".pdf")}"`,
      },
    });
  } catch (error) {
    console.error("PPTX conversion error:", error);

    return Response.json(
      {
        error: "Failed to convert PPTX to PDF",
      },
      {
        status: 500,
      },
    );
  }
}

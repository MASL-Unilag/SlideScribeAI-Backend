export class SlidePagingManager {
  public splitTextIntoPages = async (text: string) => {
    const slides: { title: string; content: string }[] = [];
    const sections = text.split("Slide ");

    for (const section of sections) {
      if (section.trim() !== "") {
        const lines = section.split("\n");
        const title = lines[0].trim();
        const content = lines
          .slice(1)
          .map((line) => line.trim())
          .join("\n");

        slides.push({
          title,
          content,
        });
      }
    }

    return slides;
  };
}

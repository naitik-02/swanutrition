

import HeroSection from "../sections/HeroSection";
import ImageBox from "../sections/ImageBox";
import EditorSection from "../sections/EditorSection";
import ReapeaterImgContent from "../sections/ReapeaterImgContent";

export default async function MainContainer({ pageData }) {
  return (
    pageData.sections &&
    pageData.sections.map((section, idx) => {
      if (section.type === "hero-section")
        return <HeroSection key={idx} fields={section.fields} design={pageData.design} />;

      if (section.type === "image-box")
        return <ImageBox key={idx}  design={pageData.design} fields={section.fields} />;

      if (section.type === "editor")
        return <EditorSection key={idx}  design={pageData.design} fields={section.fields} />;

      if (section.type === "repeater-img-content")
        return <ReapeaterImgContent key={idx}  design={pageData.design} fields={section.fields} />;

      return null;
    })
  );
}
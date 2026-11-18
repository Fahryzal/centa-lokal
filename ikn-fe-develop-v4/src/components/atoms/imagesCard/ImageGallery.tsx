import PhotoViewer from "photoviewer";
import "photoviewer/dist/photoviewer.css";

  const openViewer = (src: string) => {
    const images = [
      {
        src: src,
        title: "Data Pesanan",
      },
    ];

    new PhotoViewer(images, {
      index: 0,
      initAnimation: false,
    });
  };
  export default openViewer;

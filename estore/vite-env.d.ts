/// <reference types="vite/client" />

// تعریف ماژول‌های فایل با namespace
declare module '*.css' {
  namespace CSSModule {
    const value: string;
  }
  export default CSSModule.value;
}

declare module '*.scss' {
  namespace ScssModule {
    const value: string;
  }
  export default ScssModule.value;
}

declare module '*.sass' {
  namespace SassModule {
    const value: string;
  }
  export default SassModule.value;
}

declare module '*.less' {
  namespace LessModule {
    const value: string;
  }
  export default LessModule.value;
}

// برای تصاویر
declare module '*.svg' {
  namespace SvgModule {
    const value: string;
  }
  export default SvgModule.value;
}

declare module '*.png' {
  namespace PngModule {
    const value: string;
  }
  export default PngModule.value;
}

declare module '*.jpg' {
  namespace JpgModule {
    const value: string;
  }
  export default JpgModule.value;
}

declare module '*.jpeg' {
  namespace JpegModule {
    const value: string;
  }
  export default JpegModule.value;
}

declare module '*.gif' {
  namespace GifModule {
    const value: string;
  }
  export default GifModule.value;
}

declare module '*.webp' {
  namespace WebpModule {
    const value: string;
  }
  export default WebpModule.value;
}
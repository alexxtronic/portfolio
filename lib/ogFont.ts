// Share images are drawn at build time. Archivo Narrow is the closest static cut to the site's condensed Archivo;
// if Google Fonts can't be reached the images fall back to the default font rather than failing the build.
export async function ogFonts() {
    try {
        const css = await fetch("https://fonts.googleapis.com/css2?family=Archivo+Narrow:wght@700").then((r) => r.text());
        const url = css.match(/src: url\((.+?)\) format\('truetype'\)/)?.[1];
        if (!url) return [];
        const data = await fetch(url).then((r) => r.arrayBuffer());
        return [{ name: "Archivo Narrow", data, weight: 700 as const, style: "normal" as const }];
    } catch {
        return [];
    }
}

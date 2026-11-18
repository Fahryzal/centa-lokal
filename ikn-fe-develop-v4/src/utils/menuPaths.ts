// utils/menuPaths.ts
type MenuItem = {
  menu: string;
  path?: string;
  children?: MenuItem[];
};

export function extractPaths(menuData: MenuItem[]): string[] {
  const paths: string[] = ['/'];

  function traverse(items: MenuItem[]) {
    for (const item of items) {
      if (item.path) paths.push(item.path);
      if (item.children && item.children.length > 0) {
        traverse(item.children);
      }
    }
  }

  traverse(menuData);
  return paths;
}

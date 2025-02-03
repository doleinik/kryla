export default function getMenu(nodes) {

  const menus = {
    header: [],
    footer: [],
  };

  if (nodes) {
    nodes.forEach((menu) => {
      if (menu.locations.includes("HEADER_MENU")) {
        menus.header.push(menu);
      }
      if (
        menu.locations.includes("FOOTER_MENU_PRIM") ||
        menu.locations.includes("FOOTER_MENU_SEC")
      ) {
        menus.footer.push(menu);
      }
    });
  }

  return menus;
};

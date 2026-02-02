import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  PlusCircle,
  Layers,
  Tag,
  User,
  Users2,
  Box,
  Package2,
  Settings2,
  TagsIcon,
  LucideMoveDiagonal2,
  ShoppingBagIcon,
  MailCheck,
} from "lucide-react";

export const menuItems = [
  // Dashboard
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    permission: "view_dashboard",
  },

  // Posts
  {
    id: "posts",
    label: "Posts",
    icon: ShoppingCart,
    permission: "view_posts",
    subItems: [
      {
        label: "All",
        href: "/admin/post/all",
        icon: Package,
        permission: "view_posts",
      },
      {
        label: "Add",
        href: "/admin/post/add",
        icon: PlusCircle,
        permission: "create_posts",
      },
      {
        label: "Categories",
        href: "/admin/post/categories",
        icon: Layers,
        permission: "manage_post_categories",
      },
    ],
  },
  {
    id: "pages",
    label: "pages",
    icon: ShoppingCart,
    permission: "handle_page",
    subItems: [
      {
        label: "All",
        href: "/admin/page/all",
        icon: Package,
        permission: "view_pages",
      },
      {
        label: "Add",
        href: "/admin/page/add",
        icon: PlusCircle,
        permission: "create_pages",
      },
    ],
  },

  // Products
  {
    id: "ecommerce",
    label: "Products",
    icon: ShoppingCart,
    permission: "view_products",
    subItems: [
      {
        label: "All Products",
        href: "/admin/product/all",
        icon: Package,
        permission: "view_products",
      },
      {
        label: "Add Products",
        href: "/admin/product/add",
        icon: PlusCircle,
        permission: "create_products",
      },
      {
        label: "Categories",
        href: "/admin/product/categories",
        icon: Layers,
        permission: "manage_product_categories",
      },
      {
        label: "Brands",
        href: "/admin/product/brands",
        icon: Tag,
        permission: "manage_brands",
      },

      {
        label: "Reviews",
        href: "/admin/product/reviews",
        icon: Tag,
        permission: "manage_reviews",
      },
    ],
  },

  {
    id: "coupon",
    label: "Coupon",
    icon: User,
    href: "/admin/coupon",
  },

  {
    id: "cms",
    label: "CMS",
    icon: Package2,
    permission: "view_cms",
    subItems: [
      {
        label: "Hero",
        href: "/admin/cms/hero",
        icon: Layers,
        permission: "update_cms_hero",
      },
      {
        label: "Top-Categories",
        href: "/admin/cms/top-category",
        icon: Layers,
        permission: "update_cms_top_categories",
      },
      {
        label: "Footer",
        href: "/admin/cms/footer",
        icon: Layers,
      },
      {
        label: "Header",
        href: "/admin/cms/header",
        icon: Layers,
      },
      {
        label: "FAQs",
        href: "/admin/cms/faq",
        icon: Layers,
        permission: "update_cms_faqs",
      },
    ],
  },

  {
    id: "setting",
    label: "Setting",
    icon: Settings2,
    permission: "manage_general_settings",
    subItems: [
      {
        label: "General",
        href: "/admin/setting/general",
        icon: Layers,
        permission: "manage_general_settings",
      },
      {
        label: "Media",
        href: "/admin/setting/media",
        icon: LucideMoveDiagonal2,
        permission: "manage_media_settings",
      },
      {
        label: "Permalinks",
        href: "/admin/setting/permalink",
        icon: LucideMoveDiagonal2,
        permission: "manage_permalink_settings",
      },
    ],
  },

  {
    id: "users",
    label: "Users",
    icon: User,
    permission: "view_users",
    subItems: [
      {
        label: "All",
        href: "/admin/users/all",
        icon: Users2,
        permission: "view_users",
      },
      {
        label: "Add New",
        href: "/admin/users/add",
        icon: Users2,
        permission: "create_users",
      },
    ],
  },
  {
    id: "video",
    label: "Video",
    icon: User,
    subItems: [
      {
        label: "All",
        href: "/admin/video/all",
        icon: Users2,
      },
      {
        label: "Add New",
        href: "/admin/video/add",
        icon: Users2,
        permission: "create_users",
      },
    ],
  },
  // {
  //   id: "seller",
  //   label: "Seller",
  //   icon: User,
  //   href: "/admin/sellers",
  //   permission: "manage_sellers",
  // },

  {
    id: "orders",
    label: "Orders",
    icon: User,
    href: "/admin/orders",
  },

  // E-Commerce Settings
  {
    id: "e-commerce",
    label: "E-Commerce",
    icon: ShoppingBagIcon,
    permission: "manage_ecommerce_general",
    subItems: [
      // {
      //   label: "General",
      //   href: "/admin/e-commerce/general",
      //   icon: Layers,
      //   permission: "manage_ecommerce_general",
      // },
      // {
      //   label: "Products",
      //   href: "/admin/e-commerce/products",
      //   icon: LucideMoveDiagonal2,
      //   permission: "manage_ecommerce_products",
      // },
      {
        label: "Payment",
        href: "/admin/e-commerce/payment",
        icon: LucideMoveDiagonal2,
        permission: "manage_payments",
      },
      {
        label: "Email",
        href: "/admin/e-commerce/email",
        icon: MailCheck,
        permission: "manage_email_settings",
      },
      {
        label: "Account & Privacy",
        href: "/admin/e-commerce/account-privacy",
        icon: MailCheck,
        permission: "manage_account_privacy",
      },
      {
        label: "Visibility",
        href: "/admin/e-commerce/visibility",
        icon: MailCheck,
        permission: "manage_visibility",
      },
    ],
  },

  // Recent Activities
  // {
  //   id: "activity",
  //   label: "Recent Activities",
  //   icon: LayoutDashboard,
  //   href: "/admin/activity",
  //   permission: "view_activities",
  // },
];

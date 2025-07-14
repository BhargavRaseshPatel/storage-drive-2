export const navItems = [
  {
    name: 'Dashboard',
    icon: '/assets/icons/dashboard.svg',
    url: '/',
  },
  {
    name: 'Documents',
    icon: '/assets/icons/documents.svg',
    url: '/documents',
  },
  {
    name: 'Images',
    icon: '/assets/icons/images.svg',
    url: '/images',
  },
  {
    name: 'Media',
    icon: '/assets/icons/video.svg',
    url: '/media',
  },
  {
    name: 'Others',
    icon: '/assets/icons/others.svg',
    url: '/others',
  },
  {
    name: 'Shared',
    icon: '/assets/icons/shared.svg',
    url: '/shared'
  }
];

export const actionsDropdownItems = [
  {
    label: 'Rename',
    icon: '/assets/icons/edit.svg',
    value: 'rename',
  },
  {
    label: 'Details',
    icon: '/assets/icons/info.svg',
    value: 'details',
  },
  {
    label: 'Share',
    icon: '/assets/icons/share.svg',
    value: 'share',
  },
  {
    label: 'Download',
    icon: '/assets/icons/download.svg',
    value: 'download',
  },
  {
    label: 'Delete',
    icon: '/assets/icons/delete.svg',
    value: 'delete',
  },
];

export const sortTypes = [
  {
    label: 'Date created (newest)',
    value: '$createdAt-desc',
  },
  {
    label: 'Created Date (oldest)',
    value: '$createdAt-asc',
  },
  {
    label: 'Name (A-Z)',
    value: 'name-asc',
  },
  {
    label: 'Name (Z-A)',
    value: 'name-desc',
  },
  {
    label: 'Size (Highest)',
    value: 'size-desc',
  },
  {
    label: 'Size (Lowest)',
    value: 'size-asc',
  },
];

export const dashboardFiles = [
  {
    name: "Documents",
    url: "/assets/icons/dashboard-documents.svg",
    type: 'documents'
  },
  {
    name: "Images",
    url: "/assets/icons/dashboard-image.svg",
    type: "images"
  },
  {
    name: "Video, Audio",
    url: "/assets/icons/dashboard-video.svg",
    type: "media"
  },
  {
    name: "Others",
    url: "/assets/icons/dashboard-others.svg",
    type: "others"
  },
]

export const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
export const MAXIMUM_TOTAL_STORAGE = 100 * 1024 * 1024; // 100 MB

export const avatarPlaceholderUrl = 'https://cdn.pixabay.com/photo/2016/11/14/17/39/person-1824144_1280.png'
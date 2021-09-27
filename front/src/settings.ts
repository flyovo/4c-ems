interface Menu {
  menu: string
  title: string
  child?: Array<Menu>
}
interface MenuListTree {
  children?: Array<MenuListTree>
  label: string
  id: string
}
interface ISettings {
  title: string // Overrides the default title
  showSettings: boolean // Controls settings panel display
  showTagsView: boolean // Controls tagsview display
  showSidebarLogo: boolean // Controls siderbar logo display
  fixedHeader: boolean // If true, will fix the header component
  errorLog: string[] // The env to enable the errorlog component, default 'production' only
  sidebarTextTheme: boolean // If true, will change active text color for sidebar based on theme
  devServerPort: string // Port number for webpack-dev-server
  // mockServerPort: number // Port number for mock server
  loginTime: number
  menuListTree: Array<MenuListTree>
}

const settings: ISettings = {
  title: '4C gate - EMS',
  showSettings: true,
  showTagsView: false,
  fixedHeader: false,
  showSidebarLogo: true,
  errorLog: ['production'],
  sidebarTextTheme: true,
  devServerPort: process.env.PORT,
  // devServerPort: 9527,
  loginTime: 1800,
  menuListTree: [
    {
      id: 'dashboard',
      label: 'HOME'
    },
    {
      id: 'raw-data',
      label: 'RawData 조회',
      children: [
        {
          id: 'raw-data-hospital-storage',
          label: '외래&입원 수납 Data'
        },
        {
          id: 'raw-data-certification',
          label: '증명서 발급 Data'
        },
        {
          id: 'raw-data-arrive',
          label: '도착확인 Data'
        },
        {
          id: 'raw-data-measurements',
          label: '신체계측 Data'
        },
        {
          id: 'raw-data-failure',
          label: '실패 Data'
        }
      ]
    },
    {
      id: 'statistics',
      label: '통계 조회',
      children: [
        {
          id: 'statistics-out-patient',
          label: '외래수납'
        },
        {
          id: 'statistics-leaves',
          label: '퇴원수납'
        },
        {
          id: 'statistics-week',
          label: '요일별수납'
        },
        {
          id: 'statistics-certification',
          label: '증명서발급'
        },
        {
          id: 'statistics-wait-time',
          label: '수납대기시간'
        },
        {
          id: 'statistics-arrive',
          label: '도착확인'
        },
        {
          id: 'statistics-measurements',
          label: '신체계측'
        },
        {
          id: 'statistics-failure',
          label: '실패 Data'
        }
      ]
    }
  ]
}

export default settings

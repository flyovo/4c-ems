interface Menu {
  menu: string
  title: string
  child?: Array<Menu>
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
  menuList: Array<Menu>
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
  menuList: [
    {
      menu: 'dashboard',
      title: '대시보드'
    },
    {
      menu: 'raw-data',
      title: 'RawData 조회',
      child: [
        {
          menu: 'receipt',
          title: '외래&입원 수납 Data'
        },
        {
          menu: 'certification',
          title: '증명서 발급 Data'
        }
      ]
    },
    {
      menu: 'statistics',
      title: '통계 값',
      child: [
        {
          menu: 'out-patient',
          title: '외래 수납 실적'
        },
        {
          menu: 'in-patient',
          title: '입원 수납 실적'
        },
        {
          menu: 'certificate',
          title: '증명서 발급 실적'
        },
        {
          menu: 'receipt/week',
          title: '요일별 수납 실적'
        },
        // {
        //   menu: 'receipt/compare',
        //   title: '수납 실적비교'
        // },
        {
          menu: 'receipt/wait',
          title: '수납 대기시간'
        }
      ]
    }
  ]
}

export default settings

interface Menu {
  menu: string
  title: string
  child?: Array<Menu>
}
interface MenuListTree {
  children?: Array<MenuListTree>
  label: string,
  id: string,
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
  menuListTree: [
    {
      id: 'dashboard',
      label: 'HOME',
    },
    {
      id: 'raw-data',
      label: 'RawData 조회',
      children: [
      //   {
      //     id: 'center',
      //     label: '외래&입원 수납 Data',
      //     children: [{
      //       id: 'center',
      //       label: '본원',
      //       children: [
      //         {
      //           id: '10f',
      //           label: '10층',
      //           children: [
      //             {
      //               id: '내분비내과',
      //               label: '내분비내과',
      //             },
      //             {
      //               id: '원무과',
      //               label: '원무과',
      //             },
      //             {
      //               id: '간호과',
      //               label: '간호과',
      //             }
      //           ]
      //         },
      //         {
      //           id: '9f',
      //           label: '9층',
      //         }
      //       ]
      //     }]
      //   },
      //   {
      //     id: 'center',
      //     label: '증명서 발급 Data',
      //   },
      //   {
      //     id: 'center',
      //     label: '도착확인 Data',
      //   },
      //   {
      //     id: 'center',
      //     label: '신체계측 Data',
      //   },
      //   {
      //     id: 'center',
      //     label: '실패 Data',
      //   },
      ]
    },
    {
      id: 'statistics',
      label: '통계 조회',
      children: [
        // {
        //   id: 'center',
        //   label: '본원',
        //   children: [
        //     {
        //       id: '10f',
        //       label: '10층',
        //     },
        //     {
        //       id: '9f',
        //       label: '9층',
        //     }
        //   ]
        // }
      ]
    }
  ],
  menuList: [
    {
      menu: 'dashboard',
      title: 'HOME'
    },
    {
      menu: 'raw-data',
      title: 'RawData 조회',
      child: [
        {
          menu: 'receipt',
          title: '본관',
          child: [
            {
              menu: '10f',
              title: '10층',
            },
            {
              menu: '9f',
              title: '9층',
            }
          ]
        }
      ]
      // child: [
      //   {
      //     menu: 'receipt',
      //     title: '외래&입원 수납 Data'
      //   },
      //   {
      //     menu: 'certification',
      //     title: '증명서 발급 Data'
      //   }
      // ]
    },
    {
      menu: 'statistics',
      title: '통계 조회',
      // child: [
      //   {
      //     menu: 'out-patient',
      //     title: '외래 수납 실적'
      //   },
      //   {
      //     menu: 'in-patient',
      //     title: '입원 수납 실적'
      //   },
      //   {
      //     menu: 'certificate',
      //     title: '증명서 발급 실적'
      //   },
      //   {
      //     menu: 'receipt/week',
      //     title: '요일별 수납 실적'
      //   },
      //   {
      //     menu: 'receipt/wait',
      //     title: '수납 대기시간'
      //   }
      // ]
    }
  ]
}

export default settings

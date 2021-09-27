<template>
  <div class="login-container">
    <div class="login-container-sub">
      <el-form ref="loginForm" :model="loginForm" class="login-form" autocomplete="on" label-position="left">
        <div class="title-container">
          <img src="@/assets/images/icon-logo-4c-logo.svg" />
        </div>

        <el-form-item prop="userId">
          <span class="svg-container">
            <!-- <svg-icon name="user" /> -->
            아이디
          </span>
          <el-input ref="userId" v-model="loginForm.userId" name="userId" type="text" autocomplete="on" placeholder="아이디를 입력해주세요."></el-input>
        </el-form-item>

        <el-form-item prop="userPwd">
          <span class="svg-container">
            <!-- <svg-icon name="password" /> -->
            비밀번호
          </span>
          <el-input
            :key="passwordType"
            ref="userPwd"
            v-model="loginForm.userPwd"
            :type="passwordType"
            name="userPwd"
            autocomplete="on"
            @keyup.enter.native="handleLogin"
            placeholder="비밀번호를 입력해주세요."
          />
        </el-form-item>

        <el-checkbox v-model="idRemember">아이디 저장</el-checkbox>

        <div class="login-btn">
          <el-button type="primary" @click.native="handleLogin">{{ $t('login.login') }}</el-button>
        </div>
      </el-form>
    </div>
    <!-- <div class="copyright">
      <span class="copyright__text">copyright ⓒ 2021.</span>
      <span class="copyright__img"><img src="@/assets/images/icon-logo-4c-gray.png"/></span>
      <span class="copyright__text">All rights reserved</span>
    </div>
    <div class="version-btn-warpper">
      <el-button type="text" @click.native="showVersionDialog = true" style="color: #898b98;">Version Info</el-button>
    </div>
    <div>
      <version-popup :visible.sync="showVersionDialog" :show-dialog="showVersionDialog"></version-popup>
    </div> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { Dictionary } from 'vue-router/types/router'
import { Form as ElForm, Input } from 'element-ui'
import { UserStoreModule } from '@/store/modules/user/store'
// import { isValidUsername } from '@/utils/validate'
import VersionPopup from './VersionPopup.vue'
import { ElStep } from 'element-ui/types/step'

@Component({
  name: 'Login',
  components: {
    VersionPopup
  }
})
export default class extends Vue {
  private loginForm = {
    // userId: 'admin',
    // userPwd: '1234'
    userId: '',
    userPwd: ''
  }
  private passwordType = 'password'
  private idRemember = false
  private showDialog = false
  private showVersionDialog = false
  private redirect?: string
  private otherQuery: Dictionary<string> = {}

  @Watch('$route', { immediate: true })
  private onRouteChange(route: Route) {
    const query = route.query as Dictionary<string>
    if (query) {
      this.redirect = query.redirect
      this.otherQuery = this.getOtherQuery(query)
    }
  }
  @Watch('idRemember', { immediate: true })
  private onIdRememberChange() {
    if (this.idRemember) {
      sessionStorage.setItem('4c-saveId', this.loginForm.userId)
    }
  }

  mounted() {
    if (sessionStorage.getItem('4c-saveId')) {
      this.idRemember = true
      this.loginForm.userId = sessionStorage.getItem('4c-saveId')
    } else {
      sessionStorage.removeItem('4c-saveId')
    }
  }

  private handleLogin() {
    ;(this.$refs.loginForm as ElForm).validate(async (valid: boolean) => {
      if (valid) {
        await UserStoreModule.Login(this.loginForm).then(async (resolve: any) => {
          if (resolve === 200) {
            // this.idRemember = false
            if (this.idRemember) {
              sessionStorage.setItem('4c-saveId', this.loginForm.userId)
            }

            await this.$router.push(
              {
                path: '/'
              },
              () => {}
            )
          }
        })
      } else {
        return false
      }
    })
  }

  private getOtherQuery(query: Dictionary<string>) {
    return Object.keys(query).reduce((acc, cur) => {
      if (cur !== 'redirect') {
        acc[cur] = query[cur]
      }
      return acc
    }, {} as Dictionary<string>)
  }
}
</script>

<style lang="scss">
.login-container {
  .login-container-sub {
    min-width: 600px;
    min-height: 600px;
    width: setViewport('vw', 600);
    height: setViewport('vw', 600);
    margin: auto;
    background-color: #ffffff;
    border-radius: 20px;
    box-shadow: 0 4px 10px 0 rgba(28, 41, 90, 0.1);
    .el-input {
      display: inline-block;
      width: 60%;
      input {
        min-height: 48px;
        height: setViewport('vh', 48);
        background: transparent;
        border-radius: 6px;
        background-color: $loginInputBg;
        -webkit-appearance: none;

        // color: $middleGray-c !important;
        border: solid 1px $middleGray-d;
        &:focus {
          color: $darkGrayText;
          border: solid 2px #0058ff;
        }

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $loginBg inset !important;
          // -webkit-text-fill-color: #fff !important;
        }

        &::-webkit-input-placeholder {
          /* Chrome/Opera/Safari */
          color: $middleGray-c;
        }
        &::-moz-placeholder {
          /* Firefox 19+ */
          color: $middleGray-c;
        }
        &:-ms-input-placeholder {
          /* IE 10+ */
          color: $middleGray-c;
        }
        &:-moz-placeholder {
          /* Firefox 18- */
          color: $middleGray-c;
        }
        &::placeholder {
          color: $middleGray-c;
        }
      }
    }
    .el-form-item {
      padding: 10px 0;
      // padding: setViewport('vh', 10) 0;
      margin: 0;
    }
  }
  .el-checkbox {
    margin-left: 23%;
    .el-checkbox__inner {
      background-color: $loginInputBg;
      border-color: $middleGray-d;
    }
    .el-checkbox__label {
      color: $middleGray-c;
      font-size: 14px;
      // font-size: setViewport('vw', 14);
    }
    &.is-checked {
      & > .el-checkbox__input {
        .el-checkbox__inner {
          background-color: $loginCursorColor;
          border-color: $loginCursorColor;
        }
      }
      & > .el-checkbox__label {
        color: $loginCursorColor;
      }
    }
  }
  .login-container-dig {
    .el-form-item {
      margin-top: 2%;
      label {
        font-size: 14px;
        // font-size: setViewport('vw', 14);
        width: 100px;
      }
      .el-input {
        input {
          color: #000000;
          background: transparent;
          -webkit-appearance: none;
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  width: 100%;
  display: flex;
  overflow: hidden;
  background-color: $loginBg;
  // background-image: url('~@/assets/images/bg.png');
  background-repeat: no-repeat; /* 반복 안함 */
  background-size: cover;
  .copyright {
    width: 100%;
    margin-top: 30px;
    // margin-top: setViewport('vh', 30);
    text-align: center;
    &__text {
      font-size: 14px;
      // font-size: setViewport('vw', 14);
      color: #a1a3a9;
    }
    &__img {
      img {
        min-width: 80px;
        width: setViewport('vw', 80);
        object-fit: contain;
        vertical-align: middle;
      }
      margin-left: 10px;
      margin-right: 15px;
      // margin-left: setViewport('vw', 10);
      // margin-right: setViewport('vw', 15);
    }
  }
  .login-form {
    position: relative;
    display: flex;
    flex-direction: column;
    // width: 600px;
    // width: setViewport('vw', 600);
    height: 100%;
    max-width: 100%;
    border-radius: 20px;
    box-shadow: 0 4px 10px 0 rgba(28, 41, 90, 0.1);
    background-color: #fff;
    margin: 0 auto;
    overflow: hidden;
    .login-btn {
      height: 100%;
      display: flex;
      align-items: center;
      button {
        width: 60%;
        height: 54px;
        // height: setViewport('vh', 54);
        margin: 0 18.7% 0 21.3%;
        border-radius: 6px;
        border: 0px;
        background-color: $loginCursorColor;
      }
    }
  }

  .tips {
    font-size: 14px;
    // font-size: setViewport('vw', 14);
    margin-bottom: 10px;
    // margin-bottom: setViewport('vh', 10);
    color: #fff;

    span {
      &:first-of-type {
        margin-right: 16px;
        // margin-right: setViewport('vw', 16);
      }
    }
  }

  .svg-container {
    color: $darkGrayText;
    vertical-align: middle;
    width: 21.3%;
    padding-right: 16px;
    // padding-right: setViewport('vw', 16);
    font-size: 16px;
    // font-size: setViewport('vw', 16);
    display: inline-block;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: right;
    color: #333;
  }

  .title-container {
    position: relative;
    width: 100%;
    background-color: #ffffff;
    text-align: center;
    img {
      width: 50%;
      margin: 78px 0;
      // margin: setViewport('vh', 78) 0;
    }
    .title {
      font-size: 26px;
      // font-size: setViewport('vw', 26);
      color: white;
      text-shadow: offset-x offset-y blur-radius color inherit;
      margin: 80px auto 40px;
      // margin: setViewport('vh', 80) auto setViewport('vh', 40);
      text-align: center;
      font-weight: 800;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      // font-size: setViewport('vw', 18);
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    // right: setViewport('vw', 10);
    top: 7px;
    // top: setViewport('vh', 7);
    font-size: 16px;
    // font-size: setViewport('vw', 16);
    color: $darkGrayText;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button-group {
    position: relative;
    height: 30px;
    .el-button {
      border-color: transparent;
      background-color: transparent;
    }
  }
  .thirdparty-button-left {
    position: absolute;
    left: 0;
    bottom: 6px;
    // bottom: setViewport('vh', 6);
  }
  .thirdparty-button-right {
    position: absolute;
    right: 0;
    bottom: 6px;
    // bottom: setViewport('vh', 6);
  }

  .version-btn-warpper {
    position: absolute;
    right: 20px;
    // right: setViewport('vw', 20);
    bottom: 5px;
    // bottom: setViewport('vh', 5);
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>

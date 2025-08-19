export default defineNuxtConfig({
  devtools: { enabled: true },
  plugins: ["~/plugins/global-components.js"],
  css: ["~/assets/css/reset.css", "~/assets/css/sweetalert.scss"],

  app: {
    baseURL: process.env.NUXT_PUBLIC_BASE || "/",
    buildAssetsDir: "/_nuxt/",
    head: {
      title: "飼主聲音大調查，你的毛孩怎麼寵 | 聯合新聞網  | 寵物部落",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { charset: "utf-8" },
        {
          name: "description",
          content:
            "如果毛孩會說話，牠會爆料你怎麼寵牠嗎？😼🐶 聯合新聞網寵物部落推出「飼主聲音大調查」，邀請所有奴才們聊聊日常寵愛秘訣與購物習慣。只要填問卷，就能獲得汪喵星球折扣碼，還有機會抽大獎，讓你的真心話被聽見！",
        },
        {
          name: "keywords",
          content: "寵物 問卷 活動 毛孩 抽獎",
        },
        // Open Graph 標籤
        {
          property: "og:title",
          content: "飼主聲音大調查，你的毛孩怎麼寵 | 聯合新聞網 | 寵物部落",
        },
        {
          property: "og:description",
          content:
            "如果毛孩會說話，牠會爆料你怎麼寵牠嗎？😼🐶 聯合新聞網寵物部落推出「飼主聲音大調查」，邀請所有奴才們聊聊日常寵愛秘訣與購物習慣。只要填問卷，就能獲得汪喵星球折扣碼，還有機會抽大獎！",
        },
        {
          property: "og:url",
          content: "https://event.udn.com/bd_petsqa_2025",
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "og:site_name",
          content: "聯合新聞網",
        },
        {
          property: "og:image",
          content: "https://event.udn.com/bd_petsqa_2025/imgs/login.png",
        },
      ],
      link: [
        { rel: "icon", type: "image/x-icon" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
        { rel: "canonical", href: "https://event.udn.com/bd_petsqa_2025" },
      ],
      script: [
        // comScore
        {
          innerHTML: `
            var _comscore = _comscore || [];
            _comscore.push({ c1: "2", c2: "7390954" });
            (function() {
              var s = document.createElement("script"), 
                  el = document.getElementsByTagName("script")[0]; 
              s.async = true;
              s.src = (document.location.protocol == "https:" ? "https://sb" : "http://b") + ".scorecardresearch.com/beacon.js";
              el.parentNode.insertBefore(s, el);
            })();
          `,
          type: "text/javascript",
        },

        // Data Layer
        {
          innerHTML: `
            function getCookie(name) {
                var value = "; " + document.cookie;
                var parts = value.split("; " + name + "=");
                if (parts.length >= 2) return parts.pop().split(";").shift();
            }

            var _ga = getCookie('_ga') || '';
            var _gaA = _ga.split(".");
            var google_id = '';
            for (i=2;i<_gaA.length;i++) google_id = google_id+_gaA[i]+'.';
            google_id = google_id.substring(0,google_id.length-1);

            var user_id = getCookie("udnland");
            if (typeof user_id === 'undefined' || user_id == '') {
                user_id = undefined;
                var auth_type = '未登入';
            }
            else {
                var auth_type = '已登入_會員';
            }

            dataLayer = [{
                'user_id': user_id,
                'google_id': google_id,
                'cat': ['event_pets', '', '', '', ''],
                'content_tag': '問答',
                'auth_type': auth_type,
                'publication_date': '',
                'ffid': JSON.parse(localStorage.getItem('UDN_FID'))?.FFID,
                'dfid': JSON.parse(localStorage.getItem('UDN_FID'))?.DFID
            }];
          `,
          type: "text/javascript",
        },
        // UDN Fingerprint
        {
          innerHTML: `
            (function() {
              var script = document.createElement('script');
              script.src = 'https://p.udn.com.tw/upf/static/common/udn-fingerprint.umd.js?12';
              script.async = true;
              document.head.appendChild(script);
            })();
          `,
          type: "text/javascript",
        },
        // Google Tag Manager
        {
          innerHTML: `
            (function(w, d, s, l, i) {
                w[l] = w[l] || [];
                w[l].push({
                    'gtm.start': new Date().getTime(),
                    event: 'gtm.js'
                });
                var f = d.getElementsByTagName(s)[0],
                    j = d.createElement(s),
                    dl = l != 'dataLayer' ? '&l=' + l : '';
                j.async = true;
                j.src =
                    'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
                f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', 'GTM-NMFFZ35');
          `,
          type: "text/javascript",
        },
      ],
      __dangerouslyDisableSanitizers: ["script"],
    },
  },
  nitro: {
    output: {
      dir: "./dist",
    },
  },

  runtimeConfig: {
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL,
      domain: process.env.NUXT_PUBLIC_DOMAIN,
      base: process.env.NUXT_PUBLIC_BASE,
      turnstileSiteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY,
    },
  },

  compatibilityDate: "2025-05-29",
});

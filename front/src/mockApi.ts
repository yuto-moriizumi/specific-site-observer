import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

export default function enableMock() {
  const mockAxios = new AxiosMockAdapter(axios, { delayResponse: 500 });
  type Page = {
    url: string;
    title: string;
    img: string;
    updated: string;
    rating?: number;
  };
  const PAGES: Page[] = [
    {
      url: "https://www.google.com/",
      title: "Google",
      img:
        "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
      updated: "2018-10-24 12:23:45",
      rating: 4,
    },
    {
      url: "https://www.yahoo.co.jp/",
      title: "Yahoo",
      img:
        "https://lh3.googleusercontent.com/proxy/exwGGKh-VW_4SThSwWZwKmGLfMVq0K9C8YmC_X6I-GENSfj05dJp8UVfCOLV87vptGGqhyRWqLKxo18cCSn93QARfk74Zw793LZSvg",
      updated: "2019-10-24 12:23:45",
      rating: 5,
    },
  ];

  mockAxios.onGet("/api/pages/").reply(() => {
    return [
      200,
      {
        pages: PAGES.map((page) => {
          delete page.rating; //レーティングはページそのものに登録されているわけではないので削除
          return page;
        }),
      },
    ];
  });
  mockAxios.onGet("/api/subscriptions/").reply(() => {
    return [
      200,
      {
        pages: PAGES,
      },
    ];
  });
  mockAxios.onPost("/api/subscriptions/").reply(() => [201, null]);
  mockAxios.onPatch("/api/subscriptions/").reply(() => [200, null]);
  mockAxios.onDelete("/api/subscriptions/").reply(() => [200, null]);
}

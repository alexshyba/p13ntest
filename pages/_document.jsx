import Document, { Head, Html, Main, NextScript } from "next/document";
import { createLocalTracker } from "../lib/local-tracker";

class MyDocument extends Document {
  static getRequestContext = (ctx) => {
    const { req } = ctx;

    return {
      url: "https://" + req?.headers?.host + req?.url,
      cookies: req?.headers.cookie,
      userAgent: req?.headers["user-agent"],
    };
  };

  static async getInitialProps(ctx) {
    const serverTracker = createLocalTracker(ctx);
    const requestContext = MyDocument.getRequestContext(ctx);

    await serverTracker.initialize();
    const { signalMatches, scoring } = await serverTracker.reevaluateSignals(
      requestContext
    );

    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) =>
          (
            <App
              {...props}
              tracker={serverTracker}
              ssrMatches={signalMatches}
              scoring={scoring}
            />
          ),
      });

    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      serverState: {
        scoring,
      },
    };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta
            name="description"
            content="UniformConf, a Uniform Optimize demo site"
          />
        </Head>
        <body>
          <Main />
          <script
            id="__UNIFORM_DATA__"
            type="application/json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(this.props.serverState),
            }}
          ></script>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

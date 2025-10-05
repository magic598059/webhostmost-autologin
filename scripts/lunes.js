const puppeteer = require('puppeteer');

async function openTargetPage() {
  // 目标网页 URL（用户指定的链接）
  const targetUrl = 'https://betadash.lunes.host/login?next=/';
  console.log(`Attempting to open page: ${targetUrl}`);
  
  let browser; // 声明浏览器实例变量，便于在 finally 中关闭

  try {
    // 启动浏览器（保留无沙箱配置，适配服务器/容器环境）
    browser = await puppeteer.launch({
      headless: 'new', // 使用最新无头模式，性能更优
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // 避免权限问题
      timeout: 60000 // 浏览器启动超时时间（60秒）
    });

    // 创建新页面
    const page = await browser.newPage();
    // 设置页面视口（模拟1280x800分辨率，避免响应式布局导致元素异常）
    await page.setViewport({ width: 1280, height: 800 });

    // 导航到目标网页（等待网络空闲，确保页面加载完成）
    console.log('Navigating to target page...');
    await page.goto(targetUrl, {
      waitUntil: 'networkidle2', // 等待网络请求稳定（仅保留2个以下连接）
      timeout: 60000 // 页面导航超时时间（60秒）
    });

    // 页面加载完成后，可选：截图留存（便于验证页面是否正常打开）
    const screenshotPath = 'target-page-screenshot.png';
    await page.screenshot({ path: screenshotPath });
    console.log(`✅ Page opened successfully! Screenshot saved to: ${screenshotPath}`);

  } catch (error) {
    // 捕获过程中所有错误并打印
    console.error(`🚨 Error opening target page:`, error);
  } finally {
    // 无论成功/失败，均确保浏览器关闭（避免内存泄漏）
    if (browser) {
      await browser.close();
      console.log('Browser closed.');
    }
  }
}

// 执行主函数
openTargetPage().catch(console.error);

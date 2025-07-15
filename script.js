document.addEventListener('DOMContentLoaded', async () => {
    const goldSection = document.getElementById('gold-section');
    const currencySection = document.getElementById('currency-section');
    const cryptoSection = document.getElementById('crypto-section');

    // نام‌هایی که در سایت kifpool.me دنبالشان هستیم
    const assetsToFind = {
        gold: ['سکه امامی', 'سکه بهار آزادی', 'نیم سکه', 'ربع سکه', 'هر گرم طلای ۱۸ عیار'],
        currency: ['دلار', 'یورو', 'درهم امارات'],
        crypto: ['بیت‌کوین', 'اتریوم', 'تتر', 'شیبا', 'دوج‌کوین']
    };

    function displayData(section, data, animationDelay) {
        const priceItem = document.createElement('div');
        priceItem.classList.add('price-item');
        priceItem.style.animationDelay = `${animationDelay * 0.1}s`;

        const nameSpan = document.createElement('span');
        nameSpan.classList.add('name');
        nameSpan.textContent = data.name;

        const priceSpan = document.createElement('span');
        priceSpan.classList.add('price');
        priceSpan.textContent = data.price;

        priceItem.appendChild(nameSpan);
        priceItem.appendChild(priceSpan);
        section.appendChild(priceItem);
    }

    try {
        // ۱. دریافت HTML از سایت
        const response = await fetch('https://kifpool.me/markets');
        const htmlText = await response.text();

        // ۲. تبدیل متن HTML به یک سند DOM
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        // ۳. پیدا کردن تمام ردیف‌های قیمت
        // بر اساس ساختار سایت kifpool، هر ردیف قیمت در یک تگ a با کلاس خاص قرار دارد
        const allRows = doc.querySelectorAll('a.h-16.border-b');

        const foundAssets = {
            gold: [],
            currency: [],
            crypto: []
        };

        allRows.forEach(row => {
            const nameElement = row.querySelector('p.text-sm');
            const priceElement = row.querySelector('p.text-base');

            if (nameElement && priceElement) {
                const name = nameElement.textContent.trim();
                const price = priceElement.textContent.trim();

                // دسته‌بندی داده‌ها
                if (assetsToFind.gold.includes(name)) {
                    foundAssets.gold.push({ name, price });
                } else if (assetsToFind.currency.includes(name)) {
                    foundAssets.currency.push({ name, price });
                } else if (assetsToFind.crypto.includes(name)) {
                    foundAssets.crypto.push({ name, price });
                }
            }
        });

        // ۴. نمایش داده‌ها در بخش‌های مربوطه
        goldSection.innerHTML = '';
        foundAssets.gold.forEach((item, index) => displayData(goldSection, item, index));

        currencySection.innerHTML = '';
        foundAssets.currency.forEach((item, index) => displayData(currencySection, item, index));

        cryptoSection.innerHTML = '';
        foundAssets.crypto.forEach((item, index) => displayData(cryptoSection, item, index));

    } catch (error) {
        console.error('خطا در دریافت یا پردازش اطلاعات:', error);
        goldSection.innerHTML = '<p style="text-align:center;">خطا در بارگذاری</p>';
        currencySection.innerHTML = '';
        cryptoSection.innerHTML = '';
    }
});

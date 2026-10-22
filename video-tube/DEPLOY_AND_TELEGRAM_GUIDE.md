# Vercel Deployment, Blogger Embed & Telegram Mini App Guide

## ১. Vercel-এ ১ ক্লিকে হোস্টিং করার নিয়ম
1. [https://vercel.com](https://vercel.com) এ যান এবং আপনার GitHub বা Email দিয়ে ফ্রি লগইন করুন।
2. **"Add New..."** -> **"Project"** সিলেক্ট করুন।
3. আপনার এই `video-tube` ফোল্ডারটি GitHub-এ পুশ করে রিপোজিটরি সিলেক্ট করুন (অথবা Vercel CLI দিয়ে সরাসরি `vercel` কমান্ড দিন)।
4. Framework Preset: **Other** সিলেক্ট করে **Deploy** বাটনে চাপ দিন।
5. ১ মিনিটে আপনি পেয়ে যাবেন আপনার লাইভ লিংক (যেমন: `https://your-name.vercel.app`)।

---

## ২. Telegram Mini App (Menu Button) হিসেবে সেট করার নিয়ম
আপনার টেলিগ্রাম বট থেকে ইউজাররা যাতে **Menu Button** চাপলেই এই সাইটটি মিনি অ্যাপ হিসেবে ওপেন করতে পারে:
1. টেলিগ্রামে গিয়ে **@BotFather** সার্চ করুন এবং ওপেন করুন।
2. মেসেজ পাঠান: `/setmenubutton`
3. আপনার বটটি সিলেক্ট করুন।
4. মেনু বাটনের নাম লিখুন (যেমন: `🎬 Open Video Portal`)।
5. এবার আপনার Vercel-এর লাইভ লিংকটি দিন (যেমন: `https://your-name.vercel.app`)।
6. ব্যস! এখন যে কেউ আপনার টেলিগ্রাম বটে ঢুকলে বাম পাশের Menu বাটনে চাপ দিলেই টেলিগ্রামের ভেতরেই ফুল-স্ক্রিন মিনি অ্যাপ ওপেন হয়ে যাবে!

---

## ৩. Blogger (Blogspot)-এ চালানোর নিয়ম
1. [blogger-embed.html](blogger-embed.html) ফাইলটি ওপেন করুন।
2. ফাইলের ভেতরে `https://YOUR-PROJECT.vercel.app` লেখাটির জায়গায় আপনার আসল Vercel লাইভ লিংকটি বসান।
3. আপনার Blogger Dashboard -> **Pages** -> **New Page** (অথবা **Theme** -> **Edit HTML**) এ যান।
4. কোডটুকু পেস্ট করে **Publish** করে দিন।
5. এখন ব্লগারে ঢুকলেই সম্পূর্ণ ওয়েবসাইটটি মোবাইল ও পিসিতে লাইভ লোড হবে!

---

## ৪. Supabase ক্লাউড ডাটাবেজ স্ট্যাটাস
- **Project URL:** `https://ukiatcxfsaexijumkmmp.supabase.co`
- **Publishable Key:** `sb_publishable_dh42yd8wpCQ-FECb12CRpA__KU4xG-y`
- **Table:** `site_data` (Active & Synced)
- আপনি অ্যাডমিন প্যানেল (`admin.html`) থেকে যেকোনো পরিবর্তন করলে তা সরাসরি এই ডাটাবেজে সেভ হবে এবং ব্লগার, টেলিগ্রাম মিনি অ্যাপ ও ব্রাউজারে সাথে সাথে লাইভ সিঙ্ক হয়ে যাবে।

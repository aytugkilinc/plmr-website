PLMR WEBSITE v10 — YÜKLEME NOTU
8 Ekim 2026

Bu ZIP, mevcut Cloudflare Workers projesinin tam kaynak paketidir.
Dosyaları açın; index.html, worker.js ve wrangler.jsonc aynı ana dizinde olsun.
assets, downloads ve technical-insights klasörlerini alt klasörleriyle aktarın.

Mevcut Worker projenizde tüm dosyaları birlikte güncelleyin. Bu sürümde formun
iki yeni başvuru seçeneği worker.js içinde de tanımlandı; HTML ve Worker kodunu
birlikte yüklemek gerekir. Mevcut EMAIL ve ASSETS ayarları korunmuştur.

Komutla yayınlıyorsanız bu dizinde, size ait terminalden:

Windows:
  npx.cmd wrangler deploy --config wrangler.jsonc

macOS / Linux:
  npx wrangler deploy --config wrangler.jsonc

Bu komut kullanıcı tarafından çalıştırıldığında yayın yapar. Gerekli hesap
oturumu kendi terminalinizde açılır. Bu çalışmada hesap bağlantısı veya yayın
 yapılmamıştır. Paket, Workers kodu içerdiği için Pages dosya sürükle-bırak
paketi olarak kullanılmamalıdır.

Yalnızca ZIP dosyasının kendisini bir kaynak deposuna koymak içeriğini açmaz.
Varsa mevcut kaynak/deploy bağlantınızı kullanırken açılmış dosyaları aktarın.

Yapılan değişiklikler ve doğrulama sınırları release-notes klasöründedir.
Bu notlar ve çalışma belgeleri public statik dosyalardan dışlanmıştır.
Önceki paket geri dönüş kaynağı olarak ayrıca korunmuştur.

Kontrol özeti: 24 indekslenebilir sayfa; 1230 yerel referans kontrolü;
20 yerel Worker/form sınaması; 31 yerel HTTP önizleme kontrolü.
Video H.264, 960×540, 88,75 saniye; tamamı yerel olarak çözümlendi.
Tarayıcıda görsel/mobil kontrol, gerçek e-posta ve canlı yayın kontrolü
bu ortamda doğrulanmamıştır.

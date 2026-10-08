PLMR WEBSITE v10 — VİDEO UYUMLULUK GÜNCELLEMESİ
8 Ekim 2026

Bu paket sitenin bütün kaynak dosyalarını içerir. ZIP'i açıp içindeki dosya
ve klasörleri mevcut GitHub deponuzun ana dizinine yükleyin ve mevcut
dosyaların üzerine yazın. ZIP dosyasının kendisini yüklemek yeterli değildir.
index.html, worker.js ve wrangler.jsonc depo kökünde kalmalıdır.

Video için gereken değişiklikler:
- software.html: MP4 ve WebM kaynakları ve doğrudan açma/indirme bağlantıları.
- _headers: yeni video dosyaları için açık içerik türleri.
- assets/video/plmr-demo-90s-v10-1.mp4
- assets/video/plmr-demo-90s-v10-1.webm

Yeni video dosyalarını klasör yapısıyla birlikte yükleyin. Eski video
eski bağlantıların çalışması için pakette tutulmuştur.

GitHub bağlı production dalına commit yapılması, otomatik deployment açıksa
Cloudflare yayınını başlatır. Deployment başarılı olduktan sonra sitenin
Software sayfasını yenileyin, Play'e basın ve videonun ilerlediğini kontrol
edin. Gerekirse "Open alternative video" bağlantısını deneyin.

Canlı incelemede v10 Software sayfası görüntülendi ve eski video dosyası
indirildi. Dosya önceki ZIP'teki video ile byte düzeyinde aynıydı; tam video
çözümleme kontrolü başarılıydı. Sayfada "Unable to play media" görüldü.
Bu inceleme ortamındaki doğrudan medya açma isteği ERR_BLOCKED_BY_CLIENT
ile engellendi; bu nedenle hatanın kesin sebebi doğrulanamadı.

Yeni dosyalar özgün kayıttan 1280×720 olarak üretildi: H.264 Constrained
Baseline MP4 (fast-start) ve VP9 WebM. Dosya adları yeni olduğu için
eski video adresinin önbelleği kullanılmaz. Yeni paketin sunucuda yayını
ve gerçek tarayıcıda başarılı oynatma bu çalışmada doğrulanmamıştır.

Yayın hesabına bağlantı veya canlı site değişikliği yapılmadı.
Worker, iletişim formu ve mevcut deployment yapılandırması v10 ile aynıdır.
Önceki v10 ZIP geri dönüş için korunmuştur.
Detaylı kontrol kayıtları release-notes klasöründedir ve public assets
kapsamından dışlanmıştır.

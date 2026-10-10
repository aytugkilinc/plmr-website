# PLMR web sitesi v19

v18 dosyaları üzerinde uygulanan kapsam: web sitesindeki gerçek beklemeleri gösteren ortak logo bileşeni.
Masaüstü teklif uygulaması değiştirilmedi. Kaynak v18 paketi ve özgün `assets/img/plmr-logo-primary.png` dosyasıdır.

## Bileşen ve bağlantılar

- `assets/js/logo-loader.js`: tek ortak `window.PLMRLoading` bileşeni; maskelenmiş özgün P/L/R pikselleri, özgün M sınırından türetilmiş dönüşüm, yüzey normallerini izleyen iki tekerlek, eğime göre bisiklet ve pedal hareketi.
- `assets/css/logo-loader.css`: mevcut siyah/beyaz paleti ve yazı tipi, şeffaf zemin, mobil genişlikler, tıklamayı engellemeyen yerleşim. Form/pano göstergeleri mutlak konumlandırılır; normal belge akışını büyütmez.
- 30 HTML sayfası: ortak stil ve betik bir kez eklenir; kaynak sürümleri `v19` olur. Başlıklar, içerik ve tüm mevcut bağlantı özellikleri aynı kalır.
- `assets/js/site.js`: iletişim formu ve pano işlemleri `try/finally` ile göstergeyi temizler; video yalnız gerçek oynatma beklemesinde kendi alanında gösterir.
- Başlangıç: henüz hazır olmayan logo / yüksek öncelikli üst alan görselleri beklenir; `load` ve `error` aynı temizleme yolunu kullanır. Diğer kaynakları, videonun metadata indirmesini ve tembel görselleri beklemez.
- Çok sayfalı gezinme korunur. Bağlantı tıklaması yakalanmaz; `history`, geri/ileri, yeni sekme veya indirme davranışları değiştirilmez. Yeni sayfanın gerekli görselleri aynı başlangıç bağlantısıyla izlenir. `pagehide` ve bfcache `pageshow` temizleme yapar.

## Gerçek ilerleme sözleşmesi

Mevcut dört beklemenin toplam ilerlemesi bilinmediği için gösterge yüzde sunmaz.
İlk yokuşta küçük, sakin bekleme hareketi kullanılır; yolun sonuna doğru sahte ilerleme yapılmaz.
Yeni, gerçekten ölçülebilir bir işlem bağlanacaksa:

```js
const loading = window.PLMRLoading.begin({ target: container, label: 'Loading…' });
// Yalnız gerçek byte/adım sayılarından çağırın:
loading.update(actualLoadedBytes, knownTotalBytes);
// Aktarım bitip ölçülemeyen sunucu işlemi devam ediyorsa:
loading.indeterminate();
// Başarı, hata veya iptal yolunun finally bloğunda:
loading.end();
```

İlerleme değişmiyorsa rota konumu, tekerlekler ve pedallar değişmez; ölçülen modda sürekli çizim döngüsü yoktur.
M geometrisi yalnız 650 ms dönüşüm sırasında yeniden hesaplanır. Görünmez sekmede/alan dışında çizim durur.
Kapanış anlıktır; sonuç veya gezinme için ek bekleme uygulanmaz. Bileşen arızası form işlevini engellemez.

## Korunan dosyalar ve yayın

Özgün PNG logo, mevcut site stili, diğer görseller, videolar, indirmeler, Worker ve hosting ayarları değiştirilmedi.
Önceki sekiz isteğe bağlı eski görsel istisnası v19 Windows yükleyicisine taşındı.
Güncelleme ZIP'i yalnız değişen/yeni dosyaları içerir; kaldırılmış eski görselleri geri getirmez.
Yerel dosyalarda uygulandı. GitHub/Cloudflare yayını yapılmadı.

## Doğrulama kapsamı

16 zamanlama/durum testi, 30 sayfanın içerik/bağlantı karşılaştırması, 1.001 bisiklet konumu geometrisi ve SVG render kontrolleri geçti.
Özgün, dönüşen ve genişleyen logolar ile uçlar/çukur görsel olarak incelendi; 280 px mobil örnek oluşturuldu.
Tarayıcı yerel test URL'sini güvenlik politikası nedeniyle açmadığından gerçek tarayıcı geçmişi, CSS yerleşimi ve mobil cihaz kontrolü yapılmadı.
`pagehide/pageshow` ve mobil boyut kısıtları benzetim/hesap ile test edildi. Bu sınır raporda açıkça kayıtlıdır.

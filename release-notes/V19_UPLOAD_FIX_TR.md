# v19 güncelleme paketi yükleme düzeltmesi

Önceki v19 ZIP, yalnız 46 güncelleme dosyası içerirken manifest tüm v18/v19 site dosyalarını kaynak klasörde arıyordu. Bu paketleme hatası, temel site GitHub klasöründe bulunsa bile yüklemeyi durduruyordu.

Düzeltilmiş manifest yalnız ZIP içindeki güncelleme dosyalarını kaynakta zorunlu tutar. Betik depoyu güvenli biçimde güncelledikten sonra gerekli site dosyalarını kaynak veya GitHub klasöründen doğrular. Eski kurulum belgeleri ve geçmiş test raporları zorunlu tutulmaz. Sekiz eski görsel isteğe bağlı kalır. Kopyalama /E ile sürer; eksik kaynak dosyaları depodan silinmez. İki klasörde de eksik gerekli dosya varsa kopyalama/commit başlamaz.

Animasyon, içerik, bağlantılar ve site sürümü v19 olarak korunmuştur. GitHub'a push veya canlı yayın bu düzeltme sırasında yapılmadı.

Test yöntemi ve sonuçları: v19-uploader-checks.json. PowerShell/Robocopy/GitHub giriş akışı Windows üzerinde çalıştırılmadı; dosya paketleme ve birleştirme senaryoları Python modeliyle doğrulandı.

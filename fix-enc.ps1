$enc = [System.Text.Encoding]::UTF8
$path = "C:\Users\user\Desktop\rentalize\index.html"
$s = [System.IO.File]::ReadAllText($path, $enc)
$repl = [System.Char]::ConvertFromUtf32(65533)
$bad = [char]0xF8FC
$s = $s.Replace($repl.ToString(), [string]::Empty).Replace($bad.ToString(), [string]::Empty)
$dashWrong = [char]0x0101 + [char]0x20AC + [char]0x201D
$arrowWrong = [char]0x0101 + [char]0x2020 + [char]0x2019
$dash = [System.Char]::ConvertFromUtf32(0x2014); $arrow = [System.Char]::ConvertFromUtf32(0x2192)
$s = $s.Replace($dashWrong, $dash).Replace($arrowWrong, $arrow)
$ru = [char]0x52 + [char]0xC5 + [char]0xAB + [char]0xC5
$vir = [char]0x76 + [char]0x69 + [char]0x72 + [char]0xC5
$s = $s.Replace($ru, [System.Char]::ConvertFromUtf32(0x0052) + [System.Char]::ConvertFromUtf32(0x016B) + [System.Char]::ConvertFromUtf32(0x0161))
$s = $s.Replace($vir, [System.Char]::ConvertFromUtf32(0x76) + [System.Char]::ConvertFromUtf32(0x69) + [System.Char]::ConvertFromUtf32(0x72) + [System.Char]::ConvertFromUtf32(0x0161))
$s = $s.Replace([char]0x69 + [char]0xC5, [char]0x69 + [System.Char]::ConvertFromUtf32(0x0161))
$s = $s.Replace('mÄ—nesinÄ—', 'mėnesinė').Replace('ÄÆnaÅ', 'įnaš')
$s = [System.Text.RegularExpressions.Regex]::Replace($s, 'Rūš(\p{C}|.)iuoti', 'Rūšiuoti')
$s = [System.Text.RegularExpressions.Regex]::Replace($s, 'virš(\p{C}|.)uje', 'viršuje')
$s = [System.Text.RegularExpressions.Regex]::Replace($s, 'įnaš(\p{C}|.)as', 'įnašas')
$s = [System.Text.RegularExpressions.Regex]::Replace($s, 'iš(\p{C}|.) AdmitaFlex', 'iš AdmitaFlex')
$s = [System.Text.RegularExpressions.Regex]::Replace($s, 'įnaš(\p{C}|.)o\.', 'įnašo.')
[System.IO.File]::WriteAllText($path, $s, [System.Text.UTF8Encoding]::new($true))
Write-Host "Done"

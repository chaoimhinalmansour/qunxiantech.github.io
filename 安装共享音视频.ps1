param([string]$Destination=(Join-Path $PSScriptRoot 'assets\media'))
$ErrorActionPreference='Stop'
$root=[System.IO.Path]::GetFullPath($PSScriptRoot)
$target=[System.IO.Path]::GetFullPath($Destination)
if($target -ne [System.IO.Path]::GetFullPath((Join-Path $root 'assets\media'))){throw '请把共享音视频安装在本课件库的 assets\media 目录。'}
$manifest=Get-Content -LiteralPath (Join-Path $root 'assets\media-manifest.json') -Raw -Encoding UTF8 | ConvertFrom-Json
[System.IO.Directory]::CreateDirectory($target) | Out-Null
$base='https://github.com/chaoimhinalmansour/qunxiantech.github.io/releases/download/unlock-html-standard-20261010/'
foreach($item in $manifest){
  $name=[System.IO.Path]::GetFileName($item.file)
  if($name -ne $item.file){throw '资源文件名不符合预期。'}
  $file=Join-Path $target $name
  if(Test-Path -LiteralPath $file){
    if((Get-FileHash -LiteralPath $file -Algorithm SHA256).Hash.ToLower() -eq $item.sha256){Write-Output "已就绪：$name";continue}
    throw "已有文件校验不一致，已保留，请检查：$file"
  }
  $partial=Join-Path $target ($name+'.partial')
  if(Test-Path -LiteralPath $partial){
    if((Get-FileHash -LiteralPath $partial -Algorithm SHA256).Hash.ToLower() -ne $item.sha256){throw "已有未完成文件，已保留，请检查：$partial"}
  }else{
    Write-Output "下载：$name"
    Invoke-WebRequest -Uri ($base+$name) -OutFile $partial
    if((Get-FileHash -LiteralPath $partial -Algorithm SHA256).Hash.ToLower() -ne $item.sha256){throw "下载校验失败，文件已保留：$partial"}
  }
  Move-Item -LiteralPath $partial -Destination $file
}
Write-Output '共享音视频已全部安装，可以离线打开 index.html。'

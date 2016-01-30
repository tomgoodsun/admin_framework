<?php
$list = array(
    array( 1, 'Fedora', 'Red Hat Linux 後継のコミュニティによる実験要素が強い。', 'fedora.png'),
    array( 2, 'Red Hat Enterprise Linux', 'コミュニティによるテスト済みのFedoraをベースにして安定させた。商用。', null),
    array( 3, 'Asianux', 'アジア5ヵ国の企業が共同開発。Red Hat Enterprise Linuxベース。', null),
    array( 4, 'CentOS', 'Red Hat Enterprise Linuxのクローン。', 'centos.png'),
    array( 5, 'Scientific Linux（旧 Fermi Linux）', 'Red Hat Enterprise Linuxのクローン。', 'sl.png'),
    array( 6, 'Berry Linux', '日本人の中田裕一朗がFedoraをベースに開発。', null),
    array( 7, 'Mageia', 'Mandriva Linuxをベースに開発。オープンソース。', null),
    array( 8, 'PCLinuxOS', 'Mandriva Linuxをベースに開発。デスクトップ指向。', null),
    array( 9, 'Momonga Linux', 'Kondara MNU/Linuxの後継。', null),
    array(10, 'Vine Linux', '日本国産のLinuxディストリビューション。', null),
    array(11, 'RedHawk Linux', 'RHELのカーネルをリアルタイムLinuxカーネルに置き換えた。商用。', null),
    array(12, 'Ubuntu', '6ヶ月ごとのリリースと商用サポートを掲げる。デスクトップ環境としてUnityを採用している。', 'ubuntu.png'),
    array(13, 'Basix', 'ユーザーのカスタマイズを前提としたディストリビューション。', null),
    array(14, 'elementary OS', 'Pantheonという独自のデスクトップ環境を採用している。', null),
    array(15, 'Edubuntu', '教育用にカスタマイズされている。', 'edubuntu.png'),
    array(16, 'Elbuntu', 'ウィンドウマネージャとしてEnlightenmentを採用している。', null),
    array(17, 'Gobuntu', 'フリーソフトウェアのみを利用している。', null),
    array(18, 'Goobuntu', 'Googleが社内で開発・利用しているとされている。非公開。', null),
    array(19, 'Kubuntu', 'デスクトップ環境としてKDEを採用している。', null),
    array(20, 'Kona Linux', '最初から日本語化されており、LXDEからGNOME、KDE、Cinammonなど、いろいろなデスクトップ環境が選べるのが特徴。', null),
    array(21, 'LinuxBean', '軽量ながらも初心者向けのディストリビューション。', null),
    array(22, 'Linux Mint', 'デザインやソフトウェア環境を改善し、マルチメディア関係のコーデックを充実させている。', 'linux_mint.png'),
    array(23, 'Lubuntu', 'デスクトップ環境としてLXDEを採用している。', 'lubuntu.png'),
    array(24, 'nUbuntu', 'セキュリティツールを多数含んでいる。', null),
    array(25, 'Peppermint', 'Chromiumを搭載している軽量のディストリビューション。Webアプリとの連携も強い。', null),
    array(26, 'Ubuntu Christian Edition', '聖書全文とURLフィルタリングを搭載している。', null),
    array(27, 'Ubuntu Lite', 'レガシーデバイスを備えた古いコンピュータ用。', null),
    array(28, 'Ubuntu Studio', 'マルチメディア機能を追加したもの。リアルタイムカーネルのパッチが当てられている。', null),
    array(29, 'Xubuntu', 'デスクトップ環境としてXfceを採用している。', null),
    array(30, 'zUbuntu', 'IBM eServer zSeriesメインフレーム用。', null),
    array(31, '巫女 GNYO/Linux', 'openMosixとSCoreを利用したPCクラスタが構築可能。CDブート/HDDインストール共可能。', null),
);

$_GET += array(
    'q' => null
);
$result = array('items' => array());
$query = preg_quote($_GET['q']);
$match = '/' . $query . '/i';
foreach ($list as $item) {
    if (preg_match($match, $item[1]) || preg_match($match, $item[2])) {
        $src = $item[3];
        if ($src === null) {
            $src = 'image.png';
        }
        $result['items'][] = array(
            'id' => $item[0],
            'text' => $item[1],
            'description' => $item[2],
            'thumbnail' => array(
                'alt' => $item[1],
                'src' => 'sample/linux/' . $src,
            )
        );
    }
}
echo json_encode($result);


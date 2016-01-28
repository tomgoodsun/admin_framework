<?php
$list = array(
    array( 1, 'Fedora', 'Red Hat Linux 後継のコミュニティによる実験要素が強い。'),
    array( 2, 'Red Hat Enterprise Linux', 'コミュニティによるテスト済みのFedoraをベースにして安定させた。商用。'),
    array( 3, 'Asianux', 'アジア5ヵ国の企業が共同開発。Red Hat Enterprise Linuxベース。'),
    array( 4, 'CentOS', 'Red Hat Enterprise Linuxのクローン。'),
    array( 5, 'Scientific Linux（旧 Fermi Linux）', 'Red Hat Enterprise Linuxのクローン。'),
    array( 6, 'Berry Linux', '日本人の中田裕一朗がFedoraをベースに開発。'),
    array( 7, 'Mageia', 'Mandriva Linuxをベースに開発。オープンソース。'),
    array( 8, 'PCLinuxOS', 'Mandriva Linuxをベースに開発。デスクトップ指向。'),
    array( 9, 'Momonga Linux', 'Kondara MNU/Linuxの後継。'),
    array(10, 'Vine Linux', '日本国産のLinuxディストリビューション。'),
    array(11, 'RedHawk Linux', 'RHELのカーネルをリアルタイムLinuxカーネルに置き換えた。商用。'),
);

$_GET += array(
    'q' => null
);
$result = array('items' => array());
$query = preg_quote($_GET['q']);
$match = '/' . $query . '/i';
foreach ($list as $item) {
    if (preg_match($match, $item[1]) || preg_match($match, $item[2])) {
        $result['items'][] = array(
            'value' => $item[0],
            'text' => $item[1]
        );
    }
}
echo json_encode($result);


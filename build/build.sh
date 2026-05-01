start_time=$(date +%s)

mkdir -p dst;
mkdir -p dst/posts dst/css dst/utils dst/scripts;

echo;
cp -rv assets dst/;
echo "[1] Copied Assets";

echo;
cp -rv css/*.css dst/css/;
echo "[2] Copied CSS";

echo;
cp -rv utils/*.html dst/utils/;
echo "[3] Copied Utils";

echo;
cp -rv scripts/*.js dst/scripts/;
echo "[4] Copied Scripts";

echo;
node build/build.js
echo "[6] Posts Conversion Completed";

echo;
cp -v routes/*.html dst/
echo "[7] Copied routes";

echo;
cp -v index.html dst/
cp -v posts.html dst/
cp -v utils.html dst/
cp -v assets/icons/favicon.ico dst/
echo "[8] Copied Root Page Items";

echo;
echo "SUCCESS";
echo "Total Time: $( expr "$(date +%s)" - $start_time )s";
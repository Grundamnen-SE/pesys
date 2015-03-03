cat test.php | sed -r 's/>([0-9]+)<br/><span class="atomic_number">\1<\/span><br/g' > new_index.php

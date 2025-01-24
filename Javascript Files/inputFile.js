var inputs = document.querySelectorAll('.inputfile');
Array.prototype.forEach.call(inputs, function(input) {
	var label = input.nextElementSibling,
		labelVal = label.innerHTML;

	input.addEventListener('change', function(e) {
		var fileName = '';
		if (this.files && this.files.length > 1)
			fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
		else
			fileName = e.target.value.split('\\').pop();

		if (fileName) {
			document.getElementById('inputLabel').querySelector('p').innerHTML = "Resim Seçildi!";
		} else {
			document.getElementById('inputLabel').querySelector('p').innerHTML = "Aracın Fotoğrafı";
		}
	});
});

/*
 <div class="width-100 fileInput-area flex" title="">
        <input name="" type="file" name="file" id="file" class="inputfile" data-multiple-caption="{count} files selected" multiple required>
        <label class="cursor flex width-100 gap-50" id="" for="file"><svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.5133 1.54215C10.9082 0.914521 9.92721 0.914521 9.32214 1.54215L1.78925 9.35596C0.780804 10.402 0.780804 12.098 1.78925 13.144C2.7977 14.1901 4.43271 14.1901 5.44116 13.144L10.7386 7.64904C10.9403 7.43983 11.2673 7.43983 11.469 7.64904C11.6707 7.85825 11.6707 8.19744 11.469 8.40665L6.17154 13.9017C4.75972 15.3661 2.47069 15.3661 1.05887 13.9017C-0.352956 12.4372 -0.352956 10.0628 1.05887 8.59835L8.59175 0.784536C9.6002 -0.261511 11.2352 -0.261512 12.2437 0.784535C13.2521 1.83058 13.2521 3.52656 12.2437 4.57261L4.71515 12.3818C4.71321 12.3839 4.71124 12.3859 4.70926 12.388L4.70453 12.3929L4.70301 12.3944L4.70146 12.396C4.09561 13.014 3.1216 13.0108 2.51963 12.3864C1.91457 11.7588 1.91457 10.7412 2.51963 10.1136L7.89802 4.53452C8.09971 4.32531 8.42671 4.3253 8.6284 4.53451C8.83009 4.74372 8.8301 5.08291 8.62841 5.29213L3.25002 10.8712C3.04833 11.0804 3.04833 11.4196 3.25002 11.6288C3.45022 11.8365 3.77397 11.838 3.97592 11.6334L11.5133 3.81499C12.1184 3.18736 12.1184 2.16978 11.5133 1.54215Z" fill="#F92C2C"/></svg>
        <p></p>
        </label>
</div>
*/
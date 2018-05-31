package edc.common.util;

import com.google.zxing.*;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.common.HybridBinarizer;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import com.google.zxing.qrcode.encoder.ByteMatrix;
import com.google.zxing.qrcode.encoder.Encoder;
import com.google.zxing.qrcode.encoder.QRCode;
import org.apache.log4j.Logger;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.geom.AffineTransform;
import java.awt.image.AffineTransformOp;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Mtime on 2018/5/31.
 */
public class ZxingTool {

    private static final Logger log = Logger.getLogger(ZxingTool.class);

    private static final int IMAGE_WIDTH = 512;
    private static final int IMAGE_HEIGHT = 512;
    private static final int IMAGE_HALF_WIDTH = IMAGE_WIDTH / 2;
    private static final int FRAME_WIDTH = 2;
    private static final int QUIET_ZONE_SIZE = 4;

    private ZxingTool() {
    }

    /**
     * 因为该实现存在很大的白边（padding），因此将白边去掉
     *
     * @param contents
     * @param width
     * @param height
     * @return
     * @throws WriterException
     */


    public static BitMatrix encode(String contents, int width, int height, Map<EncodeHintType, ?> hints)
            throws WriterException {

        if (contents.isEmpty()) {
            throw new IllegalArgumentException("Found empty contents");
        }

        if (width < 0 || height < 0) {
            throw new IllegalArgumentException("Requested dimensions are too small: " + width + 'x' + height);
        }

        ErrorCorrectionLevel errorCorrectionLevel = ErrorCorrectionLevel.L;
        int quietZone = QUIET_ZONE_SIZE;
        if (hints != null) {
            ErrorCorrectionLevel requestedECLevel = (ErrorCorrectionLevel) hints.get(EncodeHintType.ERROR_CORRECTION);
            if (requestedECLevel != null) {
                errorCorrectionLevel = requestedECLevel;
            }
            Integer quietZoneInt = (Integer) hints.get(EncodeHintType.MARGIN);
            if (quietZoneInt != null) {
                quietZone = quietZoneInt;
            }
        }

        QRCode code = Encoder.encode(contents, errorCorrectionLevel, hints);
        return renderResult(code, width, height, quietZone);
    }

    // Note that the input matrix uses 0 == white, 1 == black, while the output
    // matrix uses
    // 0 == black, 255 == white (i.e. an 8 bit greyscale bitmap).
    //修改如下代码
    private static BitMatrix renderResult(QRCode code, int width, int height, int quietZone) {
        ByteMatrix input = code.getMatrix();
        if (input == null) {
            throw new IllegalStateException();
        }
        int inputWidth = input.getWidth();
        int inputHeight = input.getHeight();
        int qrWidth = inputWidth;
        int qrHeight = inputHeight;
        int outputWidth = Math.max(width, qrWidth);
        int outputHeight = Math.max(height, qrHeight);

        int multiple = Math.min(outputWidth / qrWidth, outputHeight / qrHeight);
        // Padding includes both the quiet zone and the extra white pixels to
        // accommodate the requested
        // dimensions. For example, if input is 25x25 the QR will be 33x33
        // including the quiet zone.
        // If the requested size is 200x160, the multiple will be 4, for a QR of
        // 132x132. These will
        // handle all the padding from 100x100 (the actual QR) up to 200x160.

        int leftPadding = (outputWidth - (inputWidth * multiple)) / 2;
        int topPadding = (outputHeight - (inputHeight * multiple)) / 2;

        if (leftPadding >= 0) {
            outputWidth = outputWidth - 2 * leftPadding;
            leftPadding = 0;
        }
        if (topPadding >= 0) {
            outputHeight = outputHeight - 2 * topPadding;
            topPadding = 0;
        }

        BitMatrix output = new BitMatrix(outputWidth, outputHeight);

        for (int inputY = 0, outputY = topPadding; inputY < inputHeight; inputY++, outputY += multiple) {
            // Write the contents of this row of the barcode
            for (int inputX = 0, outputX = leftPadding; inputX < inputWidth; inputX++, outputX += multiple) {
                if (input.get(inputX, inputY) == 1) {
                    output.setRegion(outputX, outputY, multiple, multiple);
                }
            }
        }

        return output;
    }

    /**
     * 生成条形码
     *
     * @param contents 条形码内容
     * @param width    条形码宽度
     * @param height   条形码高度
     * @return
     */
    public static BufferedImage encodeBarcode(String contents, int width, int height) {
        int codeWidth = 3 + // start guard
                (7 * 6) + // left bars
                5 + // middle guard
                (7 * 6) + // right bars
                3; // end guard
        codeWidth = Math.max(codeWidth, width);
        BufferedImage barcode = null;
        try {
            BitMatrix bitMatrix = new MultiFormatWriter().encode(contents, BarcodeFormat.CODE_128, codeWidth, height, null);
            barcode = MatrixToImageWriter.toBufferedImage(bitMatrix);
        } catch (Exception e) {
            log.error("mx.api.common.tools.ZxingTool.encodeBarcode:{}" , e);
        }
        return barcode;
    }

    /**
     * 解析读取条形码
     *
     * @param barcodePath 条形码文件路径
     * @return
     */
    public static String decodeBarcode(String barcodePath) {
        BufferedImage image;
        Result result = null;
        try {
            image = ImageIO.read(new File(barcodePath));
            if (image != null) {
                LuminanceSource source = new BufferedImageLuminanceSource(image);
                BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));
                result = new MultiFormatReader().decode(bitmap, null);
            }
            return result == null ? null : result.getText();
        } catch (Exception e) {
            log.error("mx.api.common.tools.ZxingTool.decodeBarcode:{}" ,e);
        }
        return null;
    }

    /**
     * 生成二维码
     *
     * @param context 二维码内容
     * @param width   二维码图片宽度
     * @param height  二维码图片高度
     * @return
     */
    public static BufferedImage encodeQRcode(String context, int width, int height) {
        BufferedImage qrCode = null;
        try {
            HashMap hints = new HashMap();
            hints.put(EncodeHintType.CHARACTER_SET, "utf-8");
            BitMatrix bitMatrix = new MultiFormatWriter().encode(context, BarcodeFormat.QR_CODE, width, height, hints);
            qrCode = MatrixToImageWriter.toBufferedImage(bitMatrix);
        } catch (WriterException ex) {
            log.error("mx.api.common.tools.ZxingTool.encodeQRcode:", ex);
        }
        return qrCode;
    }

    /**
     * 生成二维码,没有白边
     *
     * @param context 二维码内容
     * @param width   二维码图片宽度
     * @param height  二维码图片高度
     * @return
     */
    public static BufferedImage encodeQRcodeNoPadding(String context, int width, int height) {
        BufferedImage qrCode = null;
        try {
            HashMap hints = new HashMap();
            hints.put(EncodeHintType.CHARACTER_SET, "utf-8");
            BitMatrix bitMatrix = encode(context, width, height, hints);
            qrCode = MatrixToImageWriter.toBufferedImage(bitMatrix);
        } catch (WriterException ex) {
            log.error("mx.api.common.tools.ZxingTool.encodeQRcode:", ex);
        }
        return qrCode;
    }

    /**
     * 生成带有logo标志的二维码
     *
     * @param context  二维码存储内容
     * @param width    二维码宽度
     * @param height   二维码高度
     * @param logoPath 二维码logo路径
     * @return
     */
    public static BufferedImage encodeLogoQRcode(String context, int width, int height, String logoPath) {
        BufferedImage logoQRcode = null;
        try {
            // 读取Logo图像
            BufferedImage logoImage = scale(logoPath, IMAGE_WIDTH, IMAGE_HEIGHT, true);
            if(logoImage == null){
                log.error("get-BufferedImage-is-null.");
                return null;
            }
            int[][] srcPixels = new int[IMAGE_WIDTH][IMAGE_HEIGHT];
            for (int i = 0; i < logoImage.getWidth(); i++) {
                for (int j = 0; j < logoImage.getHeight(); j++) {
                    srcPixels[i][j] = logoImage.getRGB(i, j);
                }
            }

            Map<EncodeHintType, Object> hint = new HashMap<>();
            hint.put(EncodeHintType.CHARACTER_SET, "utf-8");
            hint.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);

            BitMatrix bitMatrix = new MultiFormatWriter().encode(context, BarcodeFormat.QR_CODE, width, height, hint);

            // 二维矩阵转为一维像素数组
            int halfW = bitMatrix.getWidth() / 2;
            int halfH = bitMatrix.getHeight() / 2;

            int[] pixels = new int[width * height];

            for (int y = 0; y < bitMatrix.getHeight(); y++) {
                for (int x = 0; x < bitMatrix.getWidth(); x++) {
                    // 读取图片
                    if (x > halfW - IMAGE_HALF_WIDTH
                            && x < halfW + IMAGE_HALF_WIDTH
                            && y > halfH - IMAGE_HALF_WIDTH
                            && y < halfH + IMAGE_HALF_WIDTH) {
                        pixels[y * width + x] = srcPixels[x - halfW
                                + IMAGE_HALF_WIDTH][y - halfH + IMAGE_HALF_WIDTH];
                    }
                    // 在图片四周形成边框
                    else if ((x > halfW - IMAGE_HALF_WIDTH - FRAME_WIDTH
                            && x < halfW - IMAGE_HALF_WIDTH + FRAME_WIDTH
                            && y > halfH - IMAGE_HALF_WIDTH - FRAME_WIDTH && y < halfH
                            + IMAGE_HALF_WIDTH + FRAME_WIDTH)
                            || (x > halfW + IMAGE_HALF_WIDTH - FRAME_WIDTH
                            && x < halfW + IMAGE_HALF_WIDTH + FRAME_WIDTH
                            && y > halfH - IMAGE_HALF_WIDTH - FRAME_WIDTH && y < halfH
                            + IMAGE_HALF_WIDTH + FRAME_WIDTH)
                            || (x > halfW - IMAGE_HALF_WIDTH - FRAME_WIDTH
                            && x < halfW + IMAGE_HALF_WIDTH + FRAME_WIDTH
                            && y > halfH - IMAGE_HALF_WIDTH - FRAME_WIDTH && y < halfH
                            - IMAGE_HALF_WIDTH + FRAME_WIDTH)
                            || (x > halfW - IMAGE_HALF_WIDTH - FRAME_WIDTH
                            && x < halfW + IMAGE_HALF_WIDTH + FRAME_WIDTH
                            && y > halfH + IMAGE_HALF_WIDTH - FRAME_WIDTH && y < halfH
                            + IMAGE_HALF_WIDTH + FRAME_WIDTH)) {
                        pixels[y * width + x] = 0xfffffff;
                    } else {
                        // 此处可以修改二维码的颜色，可以分别制定二维码和背景的颜色；
                        pixels[y * width + x] = bitMatrix.get(x, y) ? 0xff000000 : 0xfffffff;
                    }
                }
            }
            logoQRcode = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
            logoQRcode.getRaster().setDataElements(0, 0, width, height, pixels);
        } catch (WriterException ex) {
            log.error("mx.api.common.tools.ZxingTool.encodeLogoQRcode:{}",ex);
        }
        return logoQRcode;
    }

    /**
     * 解析读取二维码
     *
     * @param qrCodePath 二维码图片路径
     * @return
     */
    public static String decodeQRcode(String qrCodePath) {
        String qrCodeText = null;
        try {
            BufferedImage image = ImageIO.read(new File(qrCodePath));
            qrCodeText = decodeQRcode(image);
        } catch (IOException e) {
            log.error("mx.api.common.tools.ZxingTool.decodeQRcode.IOException:{}",e);
        }
        return qrCodeText;
    }

    public static String decodeQRcode(BufferedImage img) {
        String qrCodeText = null;
        try {
            LuminanceSource source = new BufferedImageLuminanceSource(img);
            Binarizer binarizer = new HybridBinarizer(source);
            BinaryBitmap binaryBitmap = new BinaryBitmap(binarizer);
            Map<DecodeHintType, Object> hints = new HashMap<>();
            hints.put(DecodeHintType.CHARACTER_SET, "UTF-8");
            // 对图像进行解码
            Result result = new MultiFormatReader().decode(binaryBitmap, hints);
            qrCodeText = result.getText();
        } catch (NotFoundException e) {
            log.error("mx.api.common.tools.ZxingTool.decodeQRcode.NotFoundException:{}",e);
        }
        return qrCodeText;
    }

    /**
     * 对图片进行缩放
     *
     * @param imgPath   图片路径
     * @param width     图片缩放后的宽度
     * @param height    图片缩放后的高度
     * @param hasFiller 是否补白
     * @return
     */
    public static BufferedImage scale(String imgPath, int width, int height, boolean hasFiller) {
        double ratio = 0.0; // 缩放比例
        File file = new File(imgPath);
        BufferedImage srcImage = null;
        Image finalImage = null;
        try {
            srcImage = ImageIO.read(file);
            finalImage = srcImage.getScaledInstance(width, height, BufferedImage.SCALE_SMOOTH);
            // 计算比例
            if ((srcImage.getHeight() > height) || (srcImage.getWidth() > width)) {
                if (srcImage.getHeight() > srcImage.getWidth()) {
                    ratio = (new Integer(height)).doubleValue() / srcImage.getHeight();
                } else {
                    ratio = (new Integer(width)).doubleValue() / srcImage.getWidth();
                }
                AffineTransformOp op = new AffineTransformOp(AffineTransform.getScaleInstance(ratio, ratio), null);
                finalImage = op.filter(srcImage, null);
            }
            if (hasFiller) {// 补白
                BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
                Graphics2D graphic = image.createGraphics();
                graphic.setColor(Color.white);
                graphic.fillRect(0, 0, width, height);
                if (width == finalImage.getWidth(null)) {
                    graphic.drawImage(finalImage, 0, (height - finalImage.getHeight(null)) / 2, finalImage.getWidth(null), finalImage.getHeight(null), Color.white, null);
                } else {
                    graphic.drawImage(finalImage, (width - finalImage.getWidth(null)) / 2, 0, finalImage.getWidth(null), finalImage.getHeight(null), Color.white, null);
                    graphic.dispose();
                    finalImage = image;
                }
            }
        } catch (IOException ex) {
            log.error("mx.api.common.tools.ZxingTool.scale.IOException:{}",ex);
        }

        return (BufferedImage) finalImage;
    }

    public static byte[] writeImageByte(BufferedImage img) {
        if (img==null){
            return null;
        }
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        try {
            if (ImageIO.write(img, "png", output)) {
                return output.toByteArray();
            }
            return null;
        } catch (IOException e) {
            log.error("writeImageByte error :{}", e);
            return null;
        }
    }

    public static byte[] writeImageByte(String code) {
        BufferedImage image = encodeQRcodeNoPadding(code, IMAGE_WIDTH, IMAGE_HEIGHT);
        return writeImageByte(image);
    }

    public static BufferedImage readImageByte(byte[] img) {
        ByteArrayInputStream in = new ByteArrayInputStream(img);
        try {
            return ImageIO.read(in);
        } catch (IOException e) {
            log.error("readImageByte error :{}", e);
            return null;
        }
    }

    public static void main(String args[]) throws Exception {
//        int w = 274;
//        for (int w=274;w<500;w++){
//        BufferedImage bufImg = encodeBarcode("iVBORw0KGgoAAAANSUhEUgAAAsYAAACaAQAAAACCw", 297, 123);
//            if(bufImg.getHeight()>=274){
//                System.out.println("w = " +w);
//                System.out.println("bufImg = " + bufImg.getHeight());
//                break;
//            }
//    }
//        byte[] decode = Base64.getDecoder().decode("iVBORw0KGgoAAAANSUhEUgAAAsYAAACaAQAAAACCwLO9AAAAcklEQVR42u3MMQqAQAwEQLt8+bpcly9fIejJKegD7CbFQnZhtmNe9azRsqq/osXsVrTsn4jx9HV3cX1rjZE1zX0jk8lkMplMJpPJZDKZTCaTyWQymUwmk8lkMplMJpPJZDKZTCaTyWQymUwmk8lk8s/yCdrf+RtN3UMXAAAAAElFTkSuQmCC");
//        BufferedImage bufImg = readImageByte(decode);

////        try {
//        File file = new File("D:\\abc.jpg");
////
//        ImageIO.write(bufImg, "JPG", file);
//        String str = decodeQRcode("D:\\abc.jpg");
//        System.out.println("decode-string:" + str);
//        } catch (IOException e) {
//            e.printStackTrace();
//        }

//        String s = decodeQRcode(readImageByte(writeImageByte("https://www.baidu.com/s?ie=UTF-8&wd=QR_CODE&tn=39042058_1_oem_dg&ch=1")));
//        System.out.println("s = " + s);

    }

}

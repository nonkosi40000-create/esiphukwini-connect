import { useState } from 'react';
import { Upload, CheckCircle, X, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  label: string;
  required?: boolean;
  bucket: string;
  folder: string;
  onUploadComplete: (url: string) => void;
  accept?: string;
  maxSizeMB?: number;
}

export function FileUpload({
  label,
  required = false,
  bucket,
  folder,
  onUploadComplete,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSizeMB = 5
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: `Maximum file size is ${maxSizeMB}MB`,
        variant: 'destructive'
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      setUploadedFile(file.name);
      onUploadComplete(publicUrl);
      
      toast({
        title: 'File uploaded',
        description: `${file.name} uploaded successfully`
      });
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    onUploadComplete('');
  };

  return (
    <div className="border border-border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium text-foreground">
              {label} {required && <span className="text-destructive">*</span>}
            </p>
            <p className="text-sm text-muted-foreground">PDF, JPG or PNG, max {maxSizeMB}MB</p>
          </div>
        </div>
        
        {uploadedFile ? (
          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700 dark:text-green-400 max-w-[120px] truncate">
              {uploadedFile}
            </span>
            <button
              type="button"
              onClick={removeFile}
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept={accept}
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
              {isUploading ? (
                <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="h-4 w-4 text-primary" />
              )}
              <span className="text-sm font-medium text-foreground">
                {isUploading ? 'Uploading...' : 'Upload'}
              </span>
            </div>
          </label>
        )}
      </div>
    </div>
  );
}
